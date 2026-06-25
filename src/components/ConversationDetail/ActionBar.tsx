import type { ActionStatus } from "../../hooks/useConversationActions";
import Spinner from "../ui/Spinner";

interface ActionBarProps {
  conversationId: string;
  assignedTo: string | null;
  status: string;
  assignState: ActionStatus;
  resolveState: ActionStatus;
  onAssign: (id: string) => void;
  onResolve: (id: string) => void;
}

function ActionBar({
  conversationId,
  assignedTo,
  status,
  assignState,
  resolveState,
  onAssign,
  onResolve,
}: ActionBarProps) {
  const isResolved = status === "resolved";
  const isAssigned = assignedTo !== null;
  const anyLoading =
    assignState.state === "loading" || resolveState.state === "loading";

  return (
    <div className="px-6 py-4 border-t border-gray-800 flex flex-col gap-3">
      {/* Error messages */}
      {assignState.state === "error" && assignState.error !== null && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2 motion-safe:animate-fade-in">
          {assignState.error}
        </p>
      )}
      {resolveState.state === "error" && resolveState.error !== null && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2 motion-safe:animate-fade-in">
          {resolveState.error}
        </p>
      )}

      {/* Success messages */}
      {assignState.state === "success" && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-3 py-2 motion-safe:animate-fade-in">
          Assigned to you. You are now responsible for this conversation.
        </p>
      )}
      {resolveState.state === "success" && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-3 py-2 motion-safe:animate-fade-in">
          Conversation resolved. Well done.
        </p>
      )}

      {/* Action buttons */}
      {!isResolved && (
        <div className="flex gap-2">
          {/* Assign button */}
          <button
            onClick={() => onAssign(conversationId)}
            disabled={anyLoading || isAssigned}
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-gray-800 text-gray-200 hover:bg-gray-700"
            aria-label="Assign conversation to me"
          >
            {assignState.state === "loading" && <Spinner />}
            {isAssigned ? "Assigned to you" : "Assign to Me"}
          </button>

          {/* Resolve button */}
          <button
            onClick={() => onResolve(conversationId)}
            disabled={anyLoading}
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-600 text-white hover:bg-emerald-500"
            aria-label="Mark conversation as resolved"
          >
            {resolveState.state === "loading" && <Spinner />}
            Resolve
          </button>
        </div>
      )}

      {isResolved && (
        <p className="text-xs text-gray-600">
          This conversation was resolved and is now closed.
        </p>
      )}
    </div>
  );
}

export default ActionBar;
