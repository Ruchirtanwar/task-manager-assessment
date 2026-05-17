
import { useTasks } from '../../context/TaskContext';
import { Calendar, Tag, Check, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const priorityColors = {
  High: 'bg-red-100 text-red-800 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-green-100 text-green-800 border-green-200',
};

const TaskCard = ({ task }) => {
  const { updateTask, deleteTask } = useTasks();
  const navigate = useNavigate();

  const isCompleted = task.status === 'completed';

  const handleToggleComplete = () => {
    updateTask(task._id, { status: isCompleted ? 'todo' : 'completed' });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task._id);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md ${isCompleted ? 'opacity-75 bg-gray-50' : ''}`}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <button
              onClick={handleToggleComplete}
              className={`mt-1 shrink-0 h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                isCompleted ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 hover:border-indigo-500'
              }`}
            >
              {isCompleted && <Check className="h-3.5 w-3.5 text-white" />}
            </button>
            
            <div>
              <h3 className={`text-lg font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button onClick={() => navigate(`/edit-task/${task._id}`)} className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-indigo-50">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={handleDelete} className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${
            priorityColors[task.priority]
            || priorityColors[task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : '']
            || 'bg-gray-100 text-gray-700 border-gray-200'
          }`}>
            {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
            task.status === 'completed' ? 'bg-green-100 text-green-800' :
            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-600'
          }`}>
            {task.status === 'in-progress' ? 'In Progress' : task.status === 'completed' ? 'Completed' : 'To Do'}
          </span>
          
          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </div>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <Tag className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <div className="flex gap-1.5">
                {task.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
