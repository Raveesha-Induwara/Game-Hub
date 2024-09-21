import { useState, useEffect } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

interface Game {
  id: number;
  name: string;
}

interface FetchGamesResponse {
  count: number;
  results: Game[];
}

const useGames = () => {
  const [games, setGames] = useState<Array<Game>>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    apiClient
      .get<FetchGamesResponse>("/games", { signal: controller.signal })
      .then((response) => {
        setGames(response.data.results);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return { games, error };
};

export default useGames;
