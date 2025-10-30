const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Get device ID from localStorage or create new one
export function getDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

// Get current user from localStorage
export function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// Save current user to localStorage
export function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// API request helper with device ID
async function apiRequest(endpoint, options = {}) {
  const deviceId = getDeviceId();
  const headers = {
    'Content-Type': 'application/json',
    'X-Device-Id': deviceId,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// User API
export const userAPI = {
  async init(displayName) {
    const deviceId = getDeviceId();
    const user = await apiRequest('/users/init', {
      method: 'POST',
      body: JSON.stringify({ displayName, deviceId }),
    });
    setCurrentUser(user);
    return user;
  },

  async getUser(userId) {
    return apiRequest(`/users/${userId}`);
  },

  async getAllUsers() {
    return apiRequest('/users');
  },
};

// Post API
export const postAPI = {
  async getAllPosts() {
    return apiRequest('/posts');
  },

  async getUserPosts(userId) {
    return apiRequest(`/posts?userId=${userId}`);
  },

  async createPost(postData) {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },
};

// Follow API
export const followAPI = {
  async getFollowing() {
    return apiRequest('/follows/following');
  },

  async checkFollowStatus(userId) {
    return apiRequest(`/follows/status/${userId}`);
  },

  async followUser(userId) {
    return apiRequest('/follows', {
      method: 'POST',
      body: JSON.stringify({ followedId: userId }),
    });
  },

  async unfollowUser(userId) {
    return apiRequest(`/follows/${userId}`, {
      method: 'DELETE',
    });
  },
};

