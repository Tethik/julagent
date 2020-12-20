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
  res.json({ zone });
}
