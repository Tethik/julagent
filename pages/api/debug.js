export default async function handler(req, res) {
  const { headers, body } = req;
  console.log({ headers, body });
  res.json({ headers, body });
}
