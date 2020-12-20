/**
 * Registering:
 *
 * registration token,
 * color
 * -> auth token (long lasting)
 */

import { serialize } from "cookie";
import { isUuid, uuid } from "uuidv4";
import { query } from "../../../data/db";

export default async function handler(req, res) {
  const {
    query: { inviteToken },
  } = req;

  if (!inviteToken || !isUuid(inviteToken)) {
    res.status(400).json({ msg: "invalid token" });
    return;
  }

  // invite_token = NULL
  const sql = `
  UPDATE users SET auth_token = $1
  WHERE invite_token = $2
  RETURNING *;
  `;

  const auth_token = uuid();

  const result = await query(sql, [auth_token, inviteToken]);

  if (result.rowCount === 0) {
    res.status(400).json({ msg: "invalid token" });
    return;
  }

  const options = {
    expires: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: true,
    path: "/",
  };

  res.setHeader("Set-Cookie", serialize("auth_token", String(auth_token), options));

  res.status(200).json({ user: result.rows[0] });
}
