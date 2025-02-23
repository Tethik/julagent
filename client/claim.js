export default async function claim(claimToken) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ claim_key: claimToken }),
  };

  const response = await fetch(`/api/zones/claim`, options);
  const { zone, discovery_bonus } = await response.json();
  return { zone, discovery_bonus };
}
