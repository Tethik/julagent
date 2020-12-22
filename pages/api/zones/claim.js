import authenticate from "../../../data/auth";
import { query } from "../../../data/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(401).end();
    return;
  }

  const user = await authenticate(req);
  if (!user) {
    res.status(403).json({ msg: "not authenticated" });
    return;
  }

  console.log(req.body);
  const { claim_key } = req.body;

  let sql = `SELECT id, name FROM zones WHERE claim_key = $1 AND live = true`;
  let result = await query(sql, [claim_key]);
  if (result.rowCount === 0) {
    res.status(403).json({ msg: "no such zone" });
    return;
  }

  const zone = result.rows[0];

  // Update old claim
  sql = "UPDATE zones SET claimed_by = $1 WHERE id = $2";

  await query(sql, [user.id, zone.id]);

  sql = `
    INSERT INTO claims (zone_id, user_id, created_at) VALUES ($1, $2, $3);
    `;

  await query(sql, [zone.id, user.id, new Date(Date.now())]);

  // Check if first time claiming this zone, in which case bonus points.
  sql = `SELECT COUNT(*) as count FROM claims WHERE user_id = $1 AND zone_id = $2`;
  result = await query(sql, [user.id, zone.id]);

  console.log(result);
  console.log(result.rows);

  let discovery_bonus = result.rows[0].count === "1" ? 20 : 0;
  if (discovery_bonus) {
    sql = `UPDATE users SET score = score + 20 WHERE id = $1`;
    await query(sql, [user.id]);
  }

  res.json({ zone, discovery_bonus });
}
