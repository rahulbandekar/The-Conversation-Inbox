function SkeletonItem() {
  return (
    <div className="px-4 py-3 border-b border-gray-800/60 animate-pulse">
      {/* Row 1 — name + time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-700" />
          <div className="h-3 w-28 bg-gray-700 rounded" />
        </div>
        <div className="h-3 w-16 bg-gray-700 rounded" />
      </div>

      {/* Row 2 — subject */}
      <div className="h-3 w-48 bg-gray-700 rounded mb-2 ml-4" />

      {/* Row 3 — message preview */}
      <div className="h-3 w-full bg-gray-700/60 rounded mb-3 ml-4" />

      {/* Row 4 — badge */}
      <div className="h-4 w-16 bg-gray-700 rounded-full ml-4" />
    </div>
  );
}

function Skeleton() {
  return (
    <div
      className="flex-1 overflow-hidden"
      aria-label="Loading conversations"
      aria-busy="true"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
