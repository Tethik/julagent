export default async function register(inviteToken) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(`/api/register/${inviteToken}`, options);
  return response.json();
}
