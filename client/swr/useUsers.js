import useSWR from "swr";
import fetcher from "./fetcher";

export default function userUsers() {
  const { data, error } = useSWR(`/api/user`, fetcher);
  return {
    users: data ? data.users : undefined,
    isLoading: !error && !data,
    isError: error,
  };
}
