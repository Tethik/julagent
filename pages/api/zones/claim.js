import authenticate from "../../../data/auth";
import { claimZone } from "../../../data/claim";

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

  const shamed =
    user.shamed_at &&
    (new Date() < new Date(new Date(user.shamed_at) + 120 * 60 * 1000) ||
      new Date() < new Date(new Date(user.shamed_at) - 30 * 60 * 1000));

  console.log(req.body);
  const { claim_key } = req.body;
  console.log("claim_key", claim_key);
  const result = await claimZone(user.id, claim_key, shamed);
  if (result.msg) {
    res.status(403).json(result);
    return;
  }
  res.json(result);
}
