import authenticate from "../../../data/auth";
import { query } from "../../../data/db";

export default async function handler(req, res) {
  const user = await authenticate(req);
  if (!user) {
    return res.status(403).json({ msg: "not authenticated" });
  }

  console.log(user);

  const sql = `
  SELECT z.id, 
        CASE 
          WHEN d.date IS NULL
            THEN '???????'
          ELSE z.name
         END as name,
         d.date as discovery_date,
         z.shape, 
         CASE 
          WHEN f.claimed_by IS NOT NULL
            THEN me.name
          ELSE u.name
         END as claimer
  FROM zones z
  LEFT JOIN users u ON z.claimed_by = u.id
  LEFT JOIN users me ON me.id = $1
  LEFT JOIN fusk_zones f ON f.zone_id = z.id AND f.claimed_by = $1
  LEFT JOIN 
    (
      SELECT user_id, zone_id, MIN(created_at) as date
      FROM claims 
      WHERE user_id = $1
      GROUP BY user_id, zone_id
    ) d ON d.zone_id = z.id
  WHERE z.live = true;
  `;

  const result = await query(sql, [user.id]);
  res.json({ zones: result.rows });
}
