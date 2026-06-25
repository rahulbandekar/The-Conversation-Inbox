import { useState } from "react";
import type { ActionState } from "../types";

export interface ActionStatus {
  state: ActionState;
  error: string | null;
}

interface UseConversationActionsResult {
  assignState: ActionStatus;
  resolveState: ActionStatus;
  assign: (id: string) => Promise<void>;
  resolve: (id: string) => Promise<void>;
  resetAssign: () => void;
  resetResolve: () => void;
}

const idle: ActionStatus = { state: "idle", error: null };

export function useConversationActions(
  onSuccess: () => void
): UseConversationActionsResult {
  const [assignState, setAssignState] = useState<ActionStatus>(idle);
  const [resolveState, setResolveState] = useState<ActionStatus>(idle);

  async function assign(id: string) {
    setAssignState({ state: "loading", error: null });

    try {
      const res = await fetch(`/api/conversations/${id}/assign`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("assign failed");
      }

      setAssignState({ state: "success", error: null });
      onSuccess();
    } catch {
      setAssignState({
        state: "error",
        error: "Failed to assign conversation. Please try again.",
      });
    }
  }

  async function resolve(id: string) {
    setResolveState({ state: "loading", error: null });

    try {
      const res = await fetch(`/api/conversations/${id}/resolve`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("resolve failed");
      }

      setResolveState({ state: "success", error: null });
      onSuccess();
    } catch {
      setResolveState({
        state: "error",
        error: "Failed to resolve conversation. Please try again.",
      });
    }
  }

  const resetAssign = () => setAssignState(idle);
  const resetResolve = () => setResolveState(idle);

  return {
    assignState,
    resolveState,
    assign,
    resolve,
    resetAssign,
    resetResolve,
  };
}
