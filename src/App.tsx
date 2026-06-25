import { useState } from "react";
import AppHeader from "./components/ui/AppHeader";
import FilterBar from "./components/FilterBar";
import ConversationList from "./components/ConversationList";
import ConversationDetail from "./components/ConversationDetail";
import Skeleton from "./components/ui/Skeleton";
import EmptyState from "./components/ui/EmptyState";
import { useConversations } from "./hooks/useConversations";
import { useKeyboardNav } from "./hooks/useKeyboardNav";
import type { Conversation, FilterState } from "./types";

const defaultFilter: FilterState = {
  status: "all",
  sortBy: "urgency",
};

function App() {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { conversations, loading, error, refetch } = useConversations(filter);

  const selectedConversation: Conversation | null =
    conversations.find((c) => c.id === selectedId) ?? null;

  const openCount = conversations.filter((c) => c.status !== "resolved").length;

  function handleSelect(id: string) {
    setSelectedId(id);
  }

  function handleDeselect() {
    setSelectedId(null);
  }

  function handleActionSuccess() {
    refetch();
  }

  useKeyboardNav({
    conversations,
    selectedId,
    onSelect: handleSelect,
    onDeselect: handleDeselect,
    onAssign: () => {
      if (selectedConversation !== null) {
        void fetch(`/api/conversations/${selectedConversation.id}/assign`, {
          method: "POST",
        }).then(() => refetch());
      }
    },
    onResolve: () => {
      if (selectedConversation !== null) {
        void fetch(`/api/conversations/${selectedConversation.id}/resolve`, {
          method: "POST",
        }).then(() => refetch());
      }
    },
  });

  function renderList() {
    if (loading) return <Skeleton />;

    if (error !== null) {
      return (
        <EmptyState
          title="Could not load conversations"
          description={error}
          action={{ label: "Try again", onClick: refetch }}
        />
      );
    }

    if (conversations.length === 0) {
      return (
        <EmptyState
          title="No conversations match this filter"
          description="Try a different status or clear all filters to see everything."
          action={{
            label: "Clear filters",
            onClick: () => setFilter(defaultFilter),
          }}
        />
      );
    }

    return (
      <ConversationList
        conversations={conversations}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
    );
  }

  function renderDetail() {
    if (selectedConversation === null) {
      return (
        <EmptyState
          title="Select a conversation"
          description="Pick a conversation from the list to view details and take action."
        />
      );
    }

    return (
      <ConversationDetail
        key={selectedConversation.id}
        conversation={selectedConversation}
        onActionSuccess={handleActionSuccess}
      />
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-950 text-gray-100 overflow-hidden">
      <AppHeader conversationCount={openCount} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel  */}
        <aside className="w-[35%] border-r border-gray-800 flex flex-col overflow-hidden">
          <FilterBar filter={filter} onChange={setFilter} />
          {renderList()}
        </aside>

        {/* Right Panel  */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {renderDetail()}
        </main>
      </div>
    </div>
  );
}

export default App;
