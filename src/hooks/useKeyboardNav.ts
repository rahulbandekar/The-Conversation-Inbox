import { useEffect } from "react";
import type { Conversation } from "../types";

interface UseKeyboardNavProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDeselect: () => void;
  onAssign: () => void;
  onResolve: () => void;
}

export function useKeyboardNav({
  conversations,
  selectedId,
  onSelect,
  onDeselect,
  onAssign,
  onResolve,
}: UseKeyboardNavProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't fire if user is typing in an input or select
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        return;
      }

      const currentIndex = conversations.findIndex((c) => c.id === selectedId);

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex =
            currentIndex === -1
              ? 0
              : Math.min(currentIndex + 1, conversations.length - 1);
          const next = conversations[nextIndex];
          if (next !== undefined) {
            onSelect(next.id);
            scrollItemIntoView(next.id);
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex =
            currentIndex === -1 ? 0 : Math.max(currentIndex - 1, 0);
          const prev = conversations[prevIndex];
          if (prev !== undefined) {
            onSelect(prev.id);
            scrollItemIntoView(prev.id);
          }
          break;
        }
        case "Escape": {
          onDeselect();
          break;
        }
        case "Enter": {
          if (selectedId !== null) {
            onSelect(selectedId);
          }
          break;
        }
        case "a":
        case "A": {
          if (selectedId !== null) {
            e.preventDefault();
            onAssign();
          }
          break;
        }
        case "r":
        case "R": {
          if (selectedId !== null) {
            e.preventDefault();
            onResolve();
          }
          break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [conversations, selectedId, onSelect, onDeselect, onAssign, onResolve]);
}

function scrollItemIntoView(id: string) {
  const element = document.querySelector(`[data-conversation-id="${id}"]`);
  element?.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
