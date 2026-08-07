import { useCallback, useEffect, useState } from 'react';

/**
 * Fetches from a live endpoint and falls back to local sample data if the
 * request fails (e.g. backend not reachable yet) — screens stay demoable
 * offline while still being wired to the real API by default.
 */
const useApiData = (fetchFn, fallbackData, deps = []) => {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchFn();
      setData(result.data ?? result);
      setIsFallback(false);
    } catch (err) {
      setData(fallbackData);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, isFallback, refetch: load };
};

export default useApiData;
