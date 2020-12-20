import authenticate from "../../../data/auth";

export default async function handler(req, res) {
  try {
    const user = await authenticate(req);
    if (!user) {
      res.status(403).end();
    } else {
      res.json({ user });
    }
  } catch (e) {
    console.error(e);
    res.status(500);
  }
}
