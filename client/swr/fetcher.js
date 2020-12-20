export default function fetcher(...args) {
  return fetch(...args, { credentials: "same-origin" }).then((res) => res.json());
}
