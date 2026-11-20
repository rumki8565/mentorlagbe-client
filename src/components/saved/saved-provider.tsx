"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

interface SavedState {
  email: string;
  ids: string[];
}

interface SavedContextValue {
  canSave: boolean;
  ready: boolean;
  isSaved: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
}

const SavedContext = createContext<SavedContextValue>({
  canSave: false,
  ready: false,
  isSaved: () => false,
  toggle: async () => undefined,
});

export const useSaved = (): SavedContextValue => useContext(SavedContext);

export default function SavedProvider({ children }: { children: ReactNode }) {
  const { data: session } = authClient.useSession();
  const email: string | null = session?.user.email ?? null;
  const canSave: boolean = session?.user.role === "student";

  const [state, setState] = useState<SavedState | null>(null);

  useEffect(() => {
    if (!canSave || !email) {
      return;
    }
    let cancelled: boolean = false;
    apiFetch<string[]>("/api/saved/ids")
      .then((ids: string[]) => {
        if (!cancelled) setState({ email, ids });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [canSave, email]);

  // Ids only count if they belong to the currently signed-in student
  const ids: string[] | null =
    state && state.email === email ? state.ids : null;

  const isSaved = (id: string): boolean => (ids ? ids.includes(id) : false);

  const toggle = async (id: string): Promise<void> => {
    if (!ids || !email) {
      return;
    }
    const alreadySaved: boolean = ids.includes(id);
    try {
      await apiFetch<{ saved: boolean }>(`/api/saved/${id}`, {
        method: alreadySaved ? "DELETE" : "POST",
      });
      setState((prev: SavedState | null) =>
        prev && prev.email === email
          ? {
              ...prev,
              ids: alreadySaved
                ? prev.ids.filter((item: string) => item !== id)
                : [...prev.ids, id],
            }
          : prev,
      );
      toast.success(
        alreadySaved ? "Removed from saved tuitions" : "Saved to your tuitions",
      );
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update saved tuitions",
      );
    }
  };

  return (
    <SavedContext.Provider
      value={{ canSave, ready: canSave && ids !== null, isSaved, toggle }}
    >
      {children}
    </SavedContext.Provider>
  );
}
