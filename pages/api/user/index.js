import authenticate from "../../../data/auth";
import { query } from "../../../data/db";

export default async function handler(req, res) {
  if (!authenticate(req)) {
    res.status(403);
  }

  const sql = `SELECT id, name, score FROM users;`;
  const result = await query(sql);
  res.json({ users: result.rows });
}
