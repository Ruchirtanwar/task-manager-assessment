// ============================================================
// Layer 2 – Presentation: EmptyState Component
// ============================================================
import { ClipboardList } from 'lucide-react';

export default function EmptyState({ onAddTask }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50">
        <ClipboardList className="h-12 w-12 text-indigo-400" aria-hidden="true" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-slate-700">No tasks yet</h2>
      <p className="mb-6 max-w-sm text-sm text-slate-500">
        You're all caught up! Add your first task to get started managing your work.
      </p>
      <button
        onClick={onAddTask}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Add your first task"
      >
        + Add your first task
      </button>
    </div>
  );
}
