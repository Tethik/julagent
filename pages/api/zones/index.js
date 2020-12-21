import { query } from "../../../data/db";

export default async function handler(req, res) {
  const sql = `
  SELECT z.id, z.name, z.shape, u.name as claimer FROM zones z
  LEFT JOIN users u ON z.claimed_by = u.id
  WHERE z.live = true;
  `;

  const result = await query(sql);
  res.json({ zones: result.rows });
}
