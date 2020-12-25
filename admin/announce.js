// automatically pick platform
const say = require("say");
const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.prod") });

const { query } = require("../data/db");

let latest = process.argv[2];

async function run() {
  const sql = `
    SELECT c.id, z.name as zone, u.name as user FROM claims c
    INNER JOIN zones z ON z.id = c.zone_id
    INNER JOIN users u ON u.id = c.user_id
    WHERE c.id > $1`;
  const result = await query(sql, [latest]);
  console.log(result.rows.length);

  for (let i = 0; i < result.rows.length; i++) {
    const r = result.rows[i];

    const { id, user, zone } = r;
    latest = Math.max(id, latest);
    const message = `${user} captured ${zone}`;
    console.log(message);
    setTimeout(() => say.speak(message, "7.0.15", 0.9), i * 7500);
    // await new Promise((resolve) => say.speak(message, "7.0.15", 0.5, resolve));
  }
}

setInterval(run, 5000);
