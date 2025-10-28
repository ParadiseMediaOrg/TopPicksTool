import XLSX from "xlsx";

const excelFilePath = "attached_assets/November Top Picks Order by GEO_1761691726701.xlsx";

console.log("📊 Reading Excel file headers...\n");

const workbook = XLSX.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

const headerRow = data[0];

console.log("📋 All column headers:");
headerRow.forEach((header, index) => {
  if (header) {
    console.log(`   Column ${index}: "${header}"`);
  }
});

console.log("\n🔍 Looking for GEO columns (those followed by 'RPC'):");
const geoColumns = [];
for (let i = 0; i < headerRow.length; i++) {
  const cell = headerRow[i];
  if (cell && typeof cell === 'string') {
    const nextCell = headerRow[i + 1];
    if (nextCell && typeof nextCell === 'string' && nextCell.includes('RPC')) {
      geoColumns.push({
        index: i,
        code: cell,
        rpcIndex: i + 1
      });
    }
  }
}

console.log("\n✅ Found GEO columns:");
geoColumns.forEach(geo => {
  console.log(`   ${geo.code} (column ${geo.index}, RPC at column ${geo.rpcIndex})`);
});
