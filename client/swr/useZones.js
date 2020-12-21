import useSWR from "swr";
import fetcher from "./fetcher";

export default function useZones() {
  const { data, error } = useSWR(`/api/zones`, fetcher);
  return {
    zones: data ? data.zones : undefined,
    isLoading: !error && !data,
    isError: error,
  };
}
