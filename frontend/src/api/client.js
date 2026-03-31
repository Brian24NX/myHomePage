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

/**
 * Stale-while-revalidate: returns cached data instantly, then fetches fresh
 * data in the background. Cached data expires after maxAge (default 10 min).
 */
function cachedRequest(path, maxAge = 10 * 60 * 1000) {
  const cacheKey = `api_cache:${path}`;

  return new Promise((resolve, reject) => {
    // Try to serve from cache first
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      if (cached && Date.now() - cached.timestamp < maxAge) {
        resolve(cached.data);
        return;
      }
    } catch {
      // Invalid cache, continue to fetch
    }

    // No valid cache — must wait for network
    request(path)
      .then(data => {
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
        resolve(data);
      })
      .catch(reject);
  });
}

/**
 * Returns cached data immediately if available (even if stale), and refreshes
 * in the background. Calls onUpdate when fresh data arrives.
 */
function staleWhileRevalidate(path, onUpdate, maxAge = 10 * 60 * 1000) {
  const cacheKey = `api_cache:${path}`;
  let served = false;

  // Try cache first
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey));
    if (cached && cached.data) {
      served = true;
      // Revalidate in background if stale
      request(path)
        .then(data => {
          localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
          if (onUpdate) onUpdate(data);
        })
        .catch(() => {}); // Silently fail background refresh
      return Promise.resolve(cached.data);
    }
  } catch {
    // Invalid cache
  }

  // No cache — fetch from network
  return request(path).then(data => {
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  });
}

export const api = {
  // Public — cached for instant loading
  getRepos: (onUpdate) => staleWhileRevalidate('/github/repos', onUpdate),
  getGitHubStats: (onUpdate) => staleWhileRevalidate('/github/stats', onUpdate),
  getCvInfo: () => cachedRequest('/cv/info'),
  getPosts: () => request('/blog'),
  getPost: (slug) => request(`/blog/${slug}`),
  submitContact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),

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
