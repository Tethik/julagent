const { query } = require("./db");

async function anticheat(user_id, claim_key) {
  let sql = `
  SELECT z.id, f.id as fusk_zone_id, z.name FROM fusk_zones f 
  INNER JOIN zones z ON z.id = f.zone_id  
  WHERE f.claim_key = $1`;
  let result = await query(sql, [claim_key]);

  if (result.rowCount === 0) {
    return false;
  }

  const zone = result.rows[0];
  console.log(zone);

  // Update old claim
  sql = "UPDATE fusk_zones SET claimed_by = $1 WHERE id = $2";

  await query(sql, [user_id, zone.id]);

  sql = `
    INSERT INTO shame (fusk_zone_id, user_id, created_at) VALUES ($1, $2, $3);
    `;

  await query(sql, [zone.fusk_zone_id, user_id, new Date()]);
  delete zone.fusk_zone_id;

  sql = `UPDATE users SET shamed_at = $1 WHERE id = $2`;
  await query(sql, [new Date(new Date().getTime() + (Math.random() * 30 + 15) * 60 * 1000), user_id]);

  return { zone, discovery_bonus: 0 };
}

module.exports = {
  claimZone: async function (user_id, claim_key, shamed) {
    let sql = `SELECT id, name FROM zones WHERE claim_key = $1 AND live = true`;
    let result = await query(sql, [claim_key]);
    if (result.rowCount === 0) {
      const cheat = anticheat(user_id, claim_key);
      if (cheat) return cheat;
      return { msg: "no such zone" };
    }

    const zone = result.rows[0];

    if (shamed) {
      sql = "UPDATE fusk_zones SET claimed_by = $1 WHERE zone_id = $2";
      await query(sql, [user_id, zone.id]);
      return { zone };
    }

    // Update old claim
    sql = "UPDATE zones SET claimed_by = $1 WHERE id = $2";

    await query(sql, [user_id, zone.id]);

    sql = `
      INSERT INTO claims (zone_id, user_id, created_at) VALUES ($1, $2, $3);
      `;

    await query(sql, [zone.id, user_id, new Date(Date.now())]);

    // Check if first time claiming this zone, in which case bonus points.
    sql = `SELECT COUNT(*) as count FROM claims WHERE user_id = $1 AND zone_id = $2`;
    result = await query(sql, [user_id, zone.id]);

    let discovery_bonus = result.rows[0].count === "1" ? 20 : 0;
    if (discovery_bonus) {
      sql = `UPDATE users SET score = score + 20 WHERE id = $1`;
      await query(sql, [user_id]);
    }

    return { zone, discovery_bonus };
  },
};
