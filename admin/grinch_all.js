const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.prod") });
const { query } = require("../data/db");
const fetch = require("node-fetch");
const { claimZone } = require("../data/claim");

async function doGrinchThings() {
  let sql = "SELECT id FROM users WHERE name = 'grinchen'";
  let result = await query(sql);
  const { id } = result.rows[0];

  sql = "SELECT name, claim_key FROM zones";
  result = await query(sql);

  console.log(`Hehehe, I will take ALL THE TIHNGS`);
  for (let index = 0; index < result.rows.length; index++) {
    const { claim_key } = result.rows[index];
    const res = await claimZone(id, claim_key);
  }
}

doGrinchThings();
