import { createContext, useState, useContext, useCallback } from 'react';
import { taskApi } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filtering states
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addTask = async (taskData) => {
    try {
      const newTask = await taskApi.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      toast.success('Task created successfully');
      return true;
    } catch (error) {
      toast.error('Failed to create task');
      return false;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskApi.updateTask(id, taskData);
      setTasks(prev => prev.map(t => t._id === id ? updatedTask : t));
      toast.success('Task updated');
      return true;
    } catch (error) {
      toast.error('Failed to update task');
      return false;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskApi.deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
      return true;
    } catch (error) {
      toast.error('Failed to delete task');
      return false;
    }
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority.toLowerCase();
    const matchesStatus = filterStatus === 'All' 
      ? true 
      : filterStatus === 'Completed' ? task.status === 'completed' : task.status !== 'completed';
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPriority && matchesStatus && matchesSearch;
  });

  const value = {
    tasks,
    filteredTasks,
    loading,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    filterPriority, setFilterPriority,
    filterStatus, setFilterStatus,
    searchQuery, setSearchQuery
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
