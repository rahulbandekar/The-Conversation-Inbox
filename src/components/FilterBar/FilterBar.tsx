import type { FilterState } from "../../types";

interface FilterBarProps {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
}

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Waiting", value: "waiting" },
  { label: "Escalated", value: "escalated" },
] as const;

const SORT_OPTIONS = [
  { label: "Urgency", value: "urgency" },
  { label: "Wait Time", value: "waitTime" },
  { label: "Recent", value: "recent" },
] as const;

function FilterBar({ filter, onChange }: FilterBarProps) {
  return (
    <div className="px-4 py-3 border-b border-gray-800 flex flex-col gap-3">
      {/* Status filters */}
      <div className="flex gap-1.5">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange({ ...filter, status: option.value })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter.status === option.value
                ? "bg-emerald-500 text-gray-950"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Sort control */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Sort by</span>
        <select
          value={filter.sortBy}
          onChange={(e) =>
            onChange({
              ...filter,
              sortBy: e.target.value as FilterState["sortBy"],
            })
          }
          className="text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
