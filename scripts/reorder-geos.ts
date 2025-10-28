import { db } from "../server/db";
import { geos } from "../shared/schema";
import { eq } from "drizzle-orm";

const desiredOrder = [
  "USA",
  "AU",  // Australia
  "CA",  // Canada
  "UK",
  "NZ",  // New Zealand
  "ZA",  // South Africa
  "IE",  // Ireland
  "DE",  // Germany
  "IT",  // Italy
  "SE",  // Sweden
  "NL",  // Netherlands
];

async function reorderGeos() {
  console.log("🔢 Reordering GEOs...\n");

  const existingGeos = await db.select().from(geos);
  
  for (let i = 0; i < desiredOrder.length; i++) {
    const code = desiredOrder[i];
    const geo = existingGeos.find(g => g.code === code);
    
    if (geo) {
      await db.update(geos)
        .set({ sortOrder: i })
        .where(eq(geos.id, geo.id));
      console.log(`  ${i + 1}. ${geo.name} (${geo.code}) - sortOrder: ${i}`);
    } else {
      console.log(`  ⚠️  ${code} not found in database`);
    }
  }

  console.log("\n✅ GEO reordering complete!");
}

reorderGeos()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
