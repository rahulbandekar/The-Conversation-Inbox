import { useState, useEffect, useMemo } from "react";
import type { Conversation, FilterState } from "../types";

interface UseConversationsResult {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const PRIORITY_ORDER = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
} as const;

export function useConversations(filter: FilterState): UseConversationsResult {
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchIndex, setFetchIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchConversations() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/conversations");

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = (await res.json()) as Conversation[];

        if (!cancelled) {
          setAllConversations(data);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load conversations. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchConversations();

    return () => {
      cancelled = true;
    };
  }, [fetchIndex]);

  const conversations = useMemo(() => {
    let result = [...allConversations];

    // Filter
    if (filter.status !== "all") {
      result = result.filter((c) => c.status === filter.status);
    }

    // Sort
    result.sort((a, b) => {
      switch (filter.sortBy) {
        case "urgency":
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        case "waitTime":
          return b.waitingMinutes - a.waitingMinutes;
        case "recent":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }, [allConversations, filter]);

  const refetch = () => setFetchIndex((i) => i + 1);

  return { conversations, loading, error, refetch };
}
