const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.prod") });
const { query } = require("../data/db");
const fetch = require("node-fetch");
const { claimZone } = require("../data/claim");

async function doGrinchThings() {
  let sql = "SELECT id FROM users WHERE name = 'grinchen'";
  let result = await query(sql);
  const { id } = result.rows[0];

  sql = "SELECT name, claim_key FROM zones WHERE claimed_by = $1";
  const user_id = process.argv[2].trim();
  result = await query(sql, [parseInt(user_id)]);

  sql = "UPDATE users SET score = score - 100 WHERE id = $1";
  result = await query(sql, [parseInt(user_id)]);

  console.log(`Hehehe, I will take ALL THE TIHNGS`);
  for (let index = 0; index < result.rows.length; index++) {
    const { claim_key } = result.rows[index];
    const res = await claimZone(id, claim_key);
    console.log(res);
  }
}

doGrinchThings();

// setInterval(doGrinchThings, 2 * 60 * 60 * 1000);
