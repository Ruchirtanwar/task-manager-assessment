import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import { TaskProvider } from '../context/TaskContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <TaskProvider>
          <Dashboard />
        </TaskProvider>
      </ProtectedRoute>
    )
  },
  {
    path: '/add-task',
    element: (
      <ProtectedRoute>
        <TaskProvider>
          <AddTask />
        </TaskProvider>
      </ProtectedRoute>
    )
  },
  {
    path: '/edit-task/:id',
    element: (
      <ProtectedRoute>
        <TaskProvider>
          <EditTask />
        </TaskProvider>
      </ProtectedRoute>
    )
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />
  }
]);

export default router;