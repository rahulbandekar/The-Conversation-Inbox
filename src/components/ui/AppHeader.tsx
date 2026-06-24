interface AppHeaderProps {
  conversationCount?: number;
}

function AppHeader({ conversationCount }: AppHeaderProps) {
  return (
    <header className="h-14 min-h-14 border-b border-gray-800 flex items-center px-6 gap-3 bg-gray-950">
      <div className="w-2 h-2 rounded-full bg-emerald-400" />
      <span className="text-sm font-semibold tracking-wide text-gray-100">
        Conversation Inbox
      </span>
      {conversationCount !== undefined && (
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
          {conversationCount} open
        </span>
      )}
      <span className="ml-auto text-sm font-bold text-yellow-500">
        Yellow.ai
      </span>
    </header>
  );
}

export default AppHeader;
