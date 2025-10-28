import { db } from "../server/db";
import { geos, brands } from "../shared/schema";

// GEOs from the screenshot
const geoData = [
  { code: "USA", name: "USA" },
  { code: "CA", name: "Canada" },
  { code: "UK", name: "UK" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "IE", name: "Ireland" },
  { code: "IN", name: "India" },
  { code: "ZA", name: "South Africa" },
];

// All unique brand names from the screenshot
const brandNames = [
  "5 Gringos",
  "7bitCasino",
  "A Big Candy",
  "Anubi Casino",
  "Avantgarde",
  "BC Game",
  "Bet Casino",
  "Betandreas",
  "BetOnline",
  "Betway",
  "BitDreams",
  "Bovada",
  "bwin",
  "Casino Infinity",
  "Casinochan",
  "Casinoly",
  "Casoo",
  "Cashwin",
  "Chipstars",
  "Dreamz",
  "Ecopayz",
  "Emu Casino",
  "Europa Casino",
  "Fastpay",
  "Frumzi",
  "Gamble",
  "Goldenbet",
  "Goldrush",
  "Ignition",
  "Jackpot City",
  "Jackpot Jill",
  "JackpotDrive",
  "Joe Fortune",
  "Jokabet",
  "Joo Casino",
  "Juicy Casino",
  "Kingmaker",
  "Lolabet",
  "Lucky Creek",
  "Lucky Hills",
  "Lucky7even",
  "MyStake",
  "Neospin",
  "Nomini",
  "Paradisewin",
  "pelican",
  "Platincasino",
  "PlayOJO",
  "Playing Bob",
  "Playgila",
  "Playplay",
  "Playzego",
  "Poolside",
  "Richy Casino",
  "Rockchip",
  "Roobet",
  "Shazam",
  "Sky Crown",
  "Slots of Vegas",
  "Spin Casino",
  "Spinbetter",
  "Sportslots",
  "Stakes",
  "Superslots",
  "Tonybet",
  "Winstler",
  "Yak Casino",
];

async function populateData() {
  console.log("Starting data population...");

  try {
    // 1. Insert all GEOs
    console.log("\n📍 Inserting GEOs...");
    for (const geoItem of geoData) {
      const [inserted] = await db.insert(geos).values(geoItem).returning();
      console.log(`  ✓ Created GEO: ${geoItem.name} (${geoItem.code}) - ID: ${inserted.id}`);
    }

    // 2. Insert all brands
    console.log("\n🎰 Inserting brands...");
    for (const brandName of brandNames) {
      const [inserted] = await db.insert(brands).values({ 
        name: brandName,
        status: "active" 
      }).returning();
      console.log(`  ✓ Created brand: ${brandName} - ID: ${inserted.id}`);
    }

    console.log("\n✅ Data population complete!");
    console.log("\n💡 Next steps:");
    console.log("   1. Open the Brand Rankings page");
    console.log("   2. Select each GEO");
    console.log("   3. Click 'Edit Rankings'");
    console.log("   4. Set the top 10 brands with their RPC values for each GEO");
  } catch (error) {
    console.error("❌ Error populating data:", error);
    throw error;
  }
}

populateData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
