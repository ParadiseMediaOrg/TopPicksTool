import XLSX from "xlsx";
import { db } from "../server/db";
import { geos, brands, brandLists, geoBrandRankings } from "../shared/schema";
import { eq } from "drizzle-orm";

const excelFilePath = "attached_assets/November Top Picks Order by GEO_1761691726701.xlsx";

async function importFromExcel() {
  console.log("📊 Reading Excel file...");
  
  const workbook = XLSX.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  
  console.log(`   Sheet: ${sheetName}, Rows: ${data.length}`);
  
  const headerRow = data[0];
  
  // Find GEO columns
  const geoColumns: Array<{ name: string; code: string; brandCol: number; rpcCol: number }> = [];
  for (let i = 0; i < headerRow.length; i++) {
    const cell = headerRow[i];
    if (cell && typeof cell === 'string') {
      const nextCell = headerRow[i + 1];
      if (nextCell && typeof nextCell === 'string' && nextCell.includes('RPC')) {
        geoColumns.push({
          name: cell,
          code: cell,
          brandCol: i,
          rpcCol: i + 1,
        });
      }
    }
  }
  
  console.log(`✅ Found ${geoColumns.length} GEOs:`, geoColumns.map(g => g.name).join(', '));
  
  // Collect unique brands and rankings
  const uniqueBrands = new Set<string>();
  const geoRankingsData: Record<string, Array<{ brand: string; rpc: number; position: number }>> = {};
  
  for (const geoCol of geoColumns) {
    const rankings: Array<{ brand: string; rpc: number; position: number }> = [];
    const seenPositions = new Set<number>();
    
    for (let rowIdx = 1; rowIdx < data.length; rowIdx++) {
      const row = data[rowIdx];
      const position = row[0];
      if (!position || typeof position !== 'number') continue;
      
      // Only process positions 1-10 for featured brands
      if (position < 1 || position > 10) continue;
      
      const brandName = row[geoCol.brandCol];
      const rpcValue = row[geoCol.rpcCol];
      
      const brandStr = typeof brandName === 'string' ? brandName.trim() : String(brandName || '').trim();
      
      if (brandStr && brandStr !== 'new' && brandStr !== '' && brandStr !== 'undefined' && brandStr !== 'null') {
        // Skip if we've already seen this position for this GEO (take first occurrence only)
        if (seenPositions.has(position)) continue;
        
        uniqueBrands.add(brandStr);
        
        let rpc = 0;
        if (typeof rpcValue === 'number') {
          rpc = rpcValue;
        } else if (typeof rpcValue === 'string') {
          rpc = parseFloat(rpcValue.replace(/[€$,]/g, ''));
        }
        
        if (!isNaN(rpc) && rpc > 0) {
          rankings.push({ brand: brandStr, rpc, position });
          seenPositions.add(position);
        }
      }
    }
    
    if (rankings.length > 0) {
      geoRankingsData[geoCol.code] = rankings;
    }
  }
  
  console.log(`\n🎰 Found ${uniqueBrands.size} unique brands`);
  
  // Fetch existing GEOs and brands
  const existingGeos = await db.select().from(geos);
  const existingBrands = await db.select().from(brands);
  
  const geoRecords: Record<string, any> = {};
  const brandRecords: Record<string, any> = {};
  
  // Map existing records
  for (const geo of existingGeos) {
    geoRecords[geo.code] = geo;
  }
  for (const brand of existingBrands) {
    brandRecords[brand.name] = brand;
  }
  
  // Insert missing GEOs
  console.log("\n📍 Processing GEOs...");
  for (const geoCol of geoColumns) {
    if (!geoRecords[geoCol.code]) {
      const [inserted] = await db.insert(geos).values({
        code: geoCol.code,
        name: geoCol.name,
      }).returning();
      geoRecords[geoCol.code] = inserted;
      console.log(`  ✓ Created: ${geoCol.name}`);
    } else {
      console.log(`  ✓ Exists: ${geoCol.name}`);
    }
  }
  
  // Insert missing brands in batches
  console.log("\n🎰 Processing brands...");
  const missingBrands = Array.from(uniqueBrands).filter(name => !brandRecords[name]);
  
  if (missingBrands.length > 0) {
    const batchSize = 50;
    for (let i = 0; i < missingBrands.length; i += batchSize) {
      const batch = missingBrands.slice(i, i + batchSize);
      const inserted = await db.insert(brands).values(
        batch.map(name => ({ name, status: "active" as const }))
      ).returning();
      
      for (const brand of inserted) {
        brandRecords[brand.name] = brand;
      }
    }
    console.log(`  ✓ Created ${missingBrands.length} new brands`);
  }
  console.log(`  ✓ Total brands: ${Object.keys(brandRecords).length}`);
  
  // Create default brand list for each GEO
  console.log("\n📋 Creating default brand lists...");
  const brandListRecords: Record<string, any> = {};
  
  for (const geoCol of geoColumns) {
    const geoRecord = geoRecords[geoCol.code];
    if (!geoRecord) continue;
    
    // Check if default list exists
    const existingLists = await db
      .select()
      .from(brandLists)
      .where(eq(brandLists.geoId, geoRecord.id));
    
    let defaultList;
    if (existingLists.length === 0) {
      // Create default list
      const [inserted] = await db.insert(brandLists).values({
        geoId: geoRecord.id,
        name: "Default",
        sortOrder: 0,
      }).returning();
      defaultList = inserted;
      console.log(`  ✓ Created default list for ${geoCol.code}`);
    } else {
      // Use first existing list
      defaultList = existingLists[0];
      console.log(`  ✓ Using existing list for ${geoCol.code}: ${defaultList.name}`);
    }
    
    brandListRecords[geoCol.code] = defaultList;
  }
  
  // Insert rankings in batches
  console.log("\n🏆 Inserting rankings...");
  let insertedCount = 0;
  
  for (const [geoCode, rankings] of Object.entries(geoRankingsData)) {
    const geoRecord = geoRecords[geoCode];
    const listRecord = brandListRecords[geoCode];
    if (!geoRecord || !listRecord) continue;
    
    // Clear existing rankings for this list first
    await db.delete(geoBrandRankings).where(eq(geoBrandRankings.listId, listRecord.id));
    
    console.log(`\n  ${geoCode}: Inserting ${rankings.length} rankings...`);
    
    // Prepare all ranking values
    const rankingValues = rankings
      .map(ranking => {
        const brand = brandRecords[ranking.brand];
        if (!brand) return null;
        
        const rpcInCents = Math.round(ranking.rpc * 100);
        
        return {
          geoId: geoRecord.id,
          listId: listRecord.id,
          brandId: brand.id,
          position: ranking.position,
          rpcInCents,
          timestamp: Date.now(),
        };
      })
      .filter(v => v !== null);
    
    // Insert in batches
    if (rankingValues.length > 0) {
      await db.insert(geoBrandRankings).values(rankingValues);
      insertedCount += rankingValues.length;
      console.log(`    ✓ Inserted ${rankingValues.length} rankings`);
    }
  }
  
  console.log(`\n✅ Import complete!`);
  console.log(`   Total inserted: ${insertedCount} rankings`);
}

importFromExcel()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
