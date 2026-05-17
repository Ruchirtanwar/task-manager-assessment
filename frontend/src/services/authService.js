// ============================================================
// Layer 4 – Data/Service Layer: Auth Service
// ============================================================
import api from './api';

const TOKEN_KEY = 'taskmanager_token';
const USER_KEY  = 'taskmanager_user';

const authService = {
  async login(email, password) {
    // Simulate API call (replace with real API when backend is ready)
    // const data = await api.post('/auth/login', { email, password });
    const data = simulateLogin(email, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  async register(name, email, password) {
    // const data = await api.post('/auth/register', { name, email, password });
    const data = simulateRegister(name, email, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUser() {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

// ─── Simulation helpers (remove once backend is live) ────────────────────────
function simulateLogin(email, password) {
  const users = JSON.parse(localStorage.getItem('tm_users') || '[]');
  const user  = users.find((u) => u.email === email);
  if (!user) throw new Error('No account found with this email.');
  if (user.password !== password) throw new Error('Incorrect password.');
  return { token: btoa(email + ':' + Date.now()), user: { id: user.id, name: user.name, email: user.email } };
}

function simulateRegister(name, email, password) {
  const users = JSON.parse(localStorage.getItem('tm_users') || '[]');
  if (users.find((u) => u.email === email)) throw new Error('Email already registered.');
  const user = { id: crypto.randomUUID(), name, email, password };
  users.push(user);
  localStorage.setItem('tm_users', JSON.stringify(users));
  return { token: btoa(email + ':' + Date.now()), user: { id: user.id, name, email } };
}

export default authService;
