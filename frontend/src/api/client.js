const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Public
  getRepos: () => request('/github/repos'),
  getGitHubStats: () => request('/github/stats'),
  getPosts: () => request('/blog'),
  getPost: (slug) => request(`/blog/${slug}`),
  submitContact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),
  getCvInfo: () => request('/cv/info'),

  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  verify: () => request('/auth/verify'),

  // Admin
  getStats: () => request('/admin/stats'),
  getAllPosts: () => request('/admin/blog'),
  createPost: (post) => request('/admin/blog', { method: 'POST', body: JSON.stringify(post) }),
  updatePost: (id, post) => request(`/admin/blog/${id}`, { method: 'PUT', body: JSON.stringify(post) }),
  deletePost: (id) => request(`/admin/blog/${id}`, { method: 'DELETE' }),
  getMessages: () => request('/admin/messages'),
  markRead: (id) => request(`/admin/messages/${id}/read`, { method: 'PUT' }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, { method: 'DELETE' }),

  // CV Upload (admin)
  uploadCv: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/admin/cv/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(error.error || 'Upload failed');
    }
    return res.json();
  },
};
