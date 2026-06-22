// Phase 1: Vue CDN compatible service (no import/export)

const BASE_URL = 'http://localhost/UAS/UAS/public';

// axios loaded from CDN
const api = window.axios.create({
  baseURL: BASE_URL,
});

window.hasToken = function hasToken() {
  return Boolean(window.localStorage.getItem('token'));
};

function getStoredToken() {
  return window.localStorage.getItem('token');
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Jika FormData, biarkan browser menentukan Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized');
    }

    return Promise.reject(error);
  }
);

// Login helper
window.login = async function login({ username, password }) {
  const res = await api.post('/api/login', {
    username,
    password,
  });

  const payload = res?.data?.data;
  const token = payload?.token;
  const user = payload?.user;

  if (!token) {
    throw new Error(
      res?.data?.message ||
      'Login gagal: token tidak ditemukan.'
    );
  }

  localStorage.setItem('token', token);

  if (user) {
    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );
  }

  return {
    token,
    user,
  };
};

window.logout = function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

window.api = api;