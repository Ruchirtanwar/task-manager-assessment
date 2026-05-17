import { useTasks } from '../../context/TaskContext';

const FilterBar = () => {
  const { filterPriority, setFilterPriority, filterStatus, setFilterStatus } = useTasks();

  return (
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center">
        <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 mr-2">
          Status:
        </label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center">
        <label htmlFor="priority-filter" className="text-sm font-medium text-gray-700 mr-2">
          Priority:
        </label>
        <select
          id="priority-filter"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
