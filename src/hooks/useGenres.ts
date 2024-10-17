import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

interface Genre {
  id: number;
  name: string;
}

interface FetchGenresResponse {
  count: number;
  results: Array<Genre>;
}

const useGenres = () => {
  const [genres, setGenres] = useState<Array<Genre>>([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    apiClient
      .get<FetchGenresResponse>("/genres", { signal: controller.signal })
      .then((response) => {
        setGenres(response.data.results);
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
  }, []);

  return { genres, error, isLoading };
};

export default useGenres;
