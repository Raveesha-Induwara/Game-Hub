import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosRequestConfig, CanceledError } from "axios";

interface FetchResponse<T> {
  count: number;
  results: Array<T>;
}

const useData = <T>(endPoint: string, requestConfig?: AxiosRequestConfig, deps?: unknown[]) => {
  const [data, setData] = useState<Array<T>>([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    apiClient
      .get<FetchResponse<T>>(endPoint, { signal: controller.signal, ...requestConfig })
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
  }, deps ? [...deps] : []);

  return { data, error, isLoading };
};

export default useData;
