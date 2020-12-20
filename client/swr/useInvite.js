import useSWR from "swr";
import fetcher from "./fetcher";

export default function useInvite(inviteToken) {
  const { data, error } = useSWR(`/api/register/${inviteToken}`, fetcher);
  console.log(data);
  return {
    user: data ? data.user : undefined,
    isLoading: !error && !data,
    isError: error,
  };
}
