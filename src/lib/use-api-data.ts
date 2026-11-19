"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface FetchState<T> {
  data: T | null;
  error: string | null;
}

interface ApiDataResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  update: (updater: (current: T) => T) => void;
}

export const useApiData = <T>(path: string): ApiDataResult<T> => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
  });

  useEffect(() => {
    let cancelled: boolean = false;
    apiFetch<T>(path)
      .then((data: T) => {
        if (!cancelled) setState({ data, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            error:
              error instanceof Error ? error.message : "Something went wrong",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  const update = useCallback((updater: (current: T) => T): void => {
    setState((prev: FetchState<T>) =>
      prev.data === null ? prev : { ...prev, data: updater(prev.data) },
    );
  }, []);

  return {
    data: state.data,
    error: state.error,
    loading: state.data === null && state.error === null,
    update,
  };
};
