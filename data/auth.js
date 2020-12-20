import { query } from "./db";

export default async function authenticate(req) {
  const { auth_token } = req.cookies;
  if (!auth_token) {
    return false;
  }
  const sql = `SELECT * FROM users WHERE auth_token = $1`;
  const res = await query(sql, [auth_token]);
  if (res.rowCount === 0) {
    return false;
  }
  return res.rows[0];
}
