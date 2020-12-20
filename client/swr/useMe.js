import useSWR from "swr";
import fetcher from "./fetcher";

export default function useMe() {
  const { data, error } = useSWR(`/api/user/me`, fetcher);
  return {
    user: data ? data.user : undefined,
    isLoading: !error && !data,
    isError: error,
  };
}
