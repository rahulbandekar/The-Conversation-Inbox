import AppHeader from "./components/ui/AppHeader";

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-950 text-gray-100 overflow-hidden">
      {/* Header */}
      <AppHeader />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel  */}
        <aside className="w-[35%] border-r border-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <p className="text-xs text-gray-500">Filter bar placeholder</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <p className="text-xs text-gray-500 p-4">
              Conversation list placeholder
            </p>
          </div>
        </aside>

        {/* Right Panel  */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-600">
              Select a conversation to get started
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
