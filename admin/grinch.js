const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });
const { query } = require("../data/db");
const fetch = require("node-fetch");
const { claimZone } = require("../data/claim");

async function doGrinchThings() {
  let sql = "SELECT id FROM users WHERE name = 'grinchen'";
  let result = await query(sql);
  const { id } = result.rows[0];

  sql = "SELECT name, claim_key FROM zones";
  result = await query(sql);

  const r = Math.round(Math.random() * (result.rows.length - 1));
  console.log(r);
  console.log(result.rows[r]);
  console.log(`Hehehe, I will take ${result.rows[r].name}`);
  const { claim_key } = result.rows[r];

  const res = await claimZone(id, claim_key);
  console.log(res);
}

// doGrinchThings();

// setInterval(doGrinchThings, 2 * 60 * 60 * 1000);
