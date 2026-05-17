import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useTasks } from '../../context/TaskContext';
import { Calendar, Tag, AlertCircle, Edit3, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { tasks, updateTask, fetchTasks } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'todo',
    dueDate: '',
    tags: '',
  });

  // Load the task from context or fetch if needed
  useEffect(() => {
    const loadTask = async () => {
      let task = tasks.find(t => t._id === id);
      if (!task) {
        await fetchTasks();
        task = tasks.find(t => t._id === id);
      }
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority
            ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
            : 'Medium',
          status: task.status || 'todo',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          tags: task.tags ? task.tags.join(', ') : '',
        });
      } else {
        toast.error('Task not found');
        navigate('/');
      }
      setIsLoading(false);
    };

    loadTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const taskData = {
        ...formData,
        priority: formData.priority.toLowerCase(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      const success = await updateTask(id, taskData);

      if (success) {
        toast.success('Task updated successfully');
        navigate('/');
      } else {
        toast.error('Failed to update task');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-amber-100 p-3 rounded-full">
                <Edit3 className="h-6 w-6 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                  Task Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    placeholder="E.g., Complete quarterly report"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="block w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    placeholder="Provide details about this task..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="block w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4 text-gray-400" /> Priority
                  </label>
                  <div className="mt-2">
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="block w-full border-gray-300 border rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none transition-shadow"
                    >
                      <option value="High">🔴 High Priority</option>
                      <option value="Medium">🟡 Medium Priority</option>
                      <option value="Low">🟢 Low Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-700 flex items-center">
                    📋 Status
                  </label>
                  <div className="mt-2">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="block w-full border-gray-300 border rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none transition-shadow"
                    >
                      <option value="todo">📝 To Do</option>
                      <option value="in-progress">⏳ In Progress</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" /> Due Date
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="dueDate"
                    id="dueDate"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="block w-full border-gray-300 border rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-gray-400" /> Tags
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    placeholder="e.g. work, urgent, meeting (comma separated)"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="block w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Add comma-separated tags to help organize your tasks.</p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditTask;
