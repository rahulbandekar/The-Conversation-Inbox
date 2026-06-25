import type { Conversation } from "../../types";
import Badge from "../ui/Badge";
import SentimentDot from "../ui/SentimentDot";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: (id: string) => void;
}

function formatWaitTime(minutes: number): string {
  if (minutes === 0) return "Resolved";
  if (minutes < 60) return `${minutes}m waiting`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0
    ? `${hours}h ${remaining}m waiting`
    : `${hours}h waiting`;
}

function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const {
    id,
    customerName,
    subject,
    lastMessage,
    priority,
    sentiment,
    waitingMinutes,
    assignedTo,
    messageCount,
  } = conversation;

  return (
    <button
      data-conversation-id={id}
      onClick={() => onClick(id)}
      className={`w-full text-left px-4 py-3 border-b border-gray-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 ${
        isSelected
          ? "bg-gray-800 border-l-2 border-l-emerald-500"
          : "hover:bg-gray-900"
      }`}
      aria-selected={isSelected}
    >
      {/* Row 1 — Name + wait time */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <SentimentDot sentiment={sentiment} />
          <span className="text-sm font-medium text-gray-100 truncate">
            {customerName}
          </span>
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0">
          {formatWaitTime(waitingMinutes)}
        </span>
      </div>

      {/* Row 2 — Subject */}
      <p className="text-xs text-gray-300 truncate mb-1 pl-4">{subject}</p>

      {/* Row 3 — Last message preview */}
      <p className="text-xs text-gray-500 truncate mb-2 pl-4">{lastMessage}</p>

      {/* Row 4 — Badge + meta */}
      <div className="flex items-center gap-2 pl-4">
        <Badge priority={priority} />
        <span className="text-xs text-gray-600">
          {messageCount} {messageCount === 1 ? "message" : "messages"}
        </span>
        {assignedTo !== null && (
          <span className="text-xs text-emerald-600 ml-auto">
            {assignedTo === "You" ? "Assigned to you" : `Assigned`}
          </span>
        )}
      </div>
    </button>
  );
}

export default ConversationItem;
