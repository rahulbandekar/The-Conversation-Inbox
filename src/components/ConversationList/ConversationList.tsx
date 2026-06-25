import type { Conversation } from "../../types";
import ConversationItem from "./ConversationItem";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  return (
    <div
      role="listbox"
      aria-label="Escalated conversations"
      aria-multiselectable="false"
      className="flex-1 overflow-y-auto"
    >
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedId === conversation.id}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}

export default ConversationList;
