// ============================================================
// Layer 2 – Presentation: FilterBar Component
// ============================================================
import { SlidersHorizontal } from 'lucide-react';

const PRIORITIES = ['all', 'low', 'medium', 'high'];
const STATUSES   = ['all', 'active', 'completed'];

export default function FilterBar({ priorityFilter, statusFilter, onPriorityChange, onStatusChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Filter tasks">
      <SlidersHorizontal className="h-4 w-4 text-slate-400" aria-hidden="true" />

      {/* Priority filter */}
      <div className="flex items-center gap-1">
        <label htmlFor="priority-filter" className="mr-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Priority
        </label>
        <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              id={p === 'all' ? 'priority-filter' : undefined}
              onClick={() => onPriorityChange(p)}
              aria-pressed={priorityFilter === p}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition ${
                priorityFilter === p
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-1">
        <label htmlFor="status-filter" className="mr-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Status
        </label>
        <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
          {STATUSES.map((s) => (
            <button
              key={s}
              id={s === 'all' ? 'status-filter' : undefined}
              onClick={() => onStatusChange(s)}
              aria-pressed={statusFilter === s}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
