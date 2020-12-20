import { uuid } from "uuidv4";
import { query } from "../../../data/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(401).end();
    return;
  }

  const { name, shape } = req.body;
  const claim_key = uuid();

  const sql = `
    INSERT INTO zones (name, shape, claim_key) VALUES ($1, $2, $3)
    ON CONFLICT (name) DO
        UPDATE SET shape = $2
    RETURNING *;
    `;

  const result = await query(sql, [name, JSON.stringify(shape), claim_key]);
  res.json({ zones: result.rows[0] });
}
