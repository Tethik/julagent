import { query } from "../../../data/db";

export default async function handler(req, res) {
  const sql = `
  SELECT z.id, z.name, z.shape, u.name as claimer FROM zones z
  LEFT JOIN (
    SELECT user_id, zone_id FROM claims WHERE id = (SELECT MAX(id) FROM claims GROUP by zone_id)) c ON c.zone_id = z.id 
  LEFT JOIN users u ON c.user_id = u.id
  WHERE z.live = true;
  `;

  const result = await query(sql);
  res.json({ zones: result.rows });
}
