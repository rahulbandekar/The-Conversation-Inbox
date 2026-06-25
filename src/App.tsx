import { useState } from "react";
import AppHeader from "./components/ui/AppHeader";
import FilterBar from "./components/FilterBar";
import ConversationList from "./components/ConversationList";
import Skeleton from "./components/ui/Skeleton";
import EmptyState from "./components/ui/EmptyState";
import { useConversations } from "./hooks/useConversations";
import type { FilterState } from "./types";

const defaultFilter: FilterState = {
  status: "all",
  sortBy: "urgency",
};

function App() {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { conversations, loading, error, refetch } = useConversations(filter);

  const openCount = conversations.filter((c) => c.status !== "resolved").length;

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
          title="No conversations found"
          description="No conversations match your filters. Try adjusting the view."
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
        onSelect={setSelectedId}
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
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              title="No conversation selected"
              description="Select a conversation from the list to get started."
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
