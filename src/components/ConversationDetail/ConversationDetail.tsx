import type { Conversation } from "../../types";
import Badge from "../ui/Badge";
import SentimentDot from "../ui/SentimentDot";
import ActionBar from "./ActionBar";
import { useConversationActions } from "../../hooks/useConversationActions";

interface ConversationDetailProps {
  conversation: Conversation;
  onActionSuccess: () => void;
}

function formatWaitTime(minutes: number): string {
  if (minutes === 0) return "Resolved";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

function ConversationDetail({
  conversation,
  onActionSuccess,
}: ConversationDetailProps) {
  const {
    customerName,
    customerEmail,
    subject,
    lastMessage,
    priority,
    sentiment,
    waitingMinutes,
    assignedTo,
    tags,
    messageCount,
    status,
  } = conversation;

  const { assignState, resolveState, assign, resolve } =
    useConversationActions(onActionSuccess);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Detail Header */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-100 truncate mb-0.5">
              {customerName}
            </h2>
            <p className="text-xs text-gray-500 truncate">{customerEmail}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <SentimentDot sentiment={sentiment} />
            <Badge priority={priority} />
          </div>
        </div>

        {/* Subject */}
        <p className="text-sm text-gray-300 font-medium mb-3">{subject}</p>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>
            <span className="text-gray-600">Waiting </span>
            <span className="text-gray-400">
              {formatWaitTime(waitingMinutes)}
            </span>
          </span>
          <span>
            <span className="text-gray-600">Messages </span>
            <span className="text-gray-400">{messageCount}</span>
          </span>
          <span>
            <span className="text-gray-600">Status </span>
            <span className="text-gray-400 capitalize">{status}</span>
          </span>
          {assignedTo !== null && (
            <span>
              <span className="text-gray-600">Assigned to </span>
              <span className="text-emerald-400">
                {assignedTo === "You" ? "You" : assignedTo}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="px-6 py-3 border-b border-gray-800 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Last Message */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <p className="text-xs text-gray-600 uppercase tracking-wide mb-3 font-medium">
          Last message
        </p>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-gray-300 leading-relaxed">{lastMessage}</p>
        </div>
      </div>

      {/* Action Bar */}
      <ActionBar
        conversationId={conversation.id}
        assignedTo={assignedTo}
        status={status}
        assignState={assignState}
        resolveState={resolveState}
        onAssign={assign}
        onResolve={resolve}
      />
    </div>
  );
}

export default ConversationDetail;
