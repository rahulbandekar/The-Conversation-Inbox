// ─── Primitives ───────────────────────────────────────────────────────────────

export type Priority = "critical" | "high" | "medium" | "low";

export type Status = "open" | "waiting" | "escalated" | "resolved";

export type Sentiment = "angry" | "frustrated" | "neutral" | "satisfied";

// ─── Core Entity ──────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  lastMessage: string;
  status: Status;
  priority: Priority;
  sentiment: Sentiment;
  waitingMinutes: number; // how long since escalation
  assignedTo: string | null; // null = unassigned
  tags: string[];
  messageCount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type ActionState = "idle" | "loading" | "success" | "error";

export interface FilterState {
  status: Status | "all";
  sortBy: "urgency" | "waitTime" | "recent";
}
