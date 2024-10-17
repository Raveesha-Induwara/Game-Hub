import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

interface FetchResponse<T> {
  count: number;
  results: Array<T>;
}

const useData = <T>(endPoint: string) => {
  const [data, setData] = useState<Array<T>>([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    apiClient
      .get<FetchResponse<T>>(endPoint, { signal: controller.signal })
      .then((response) => {
        setData(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [endPoint]);

  return { data, error, isLoading };
};

export default useData;
