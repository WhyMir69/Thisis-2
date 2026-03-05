const API_BASE_URL = 'http://localhost:8000';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        // Handle FastAPI validation errors
        if (error.detail && Array.isArray(error.detail)) {
          const messages = error.detail.map(err => `${err.loc[1]}: ${err.msg}`).join(', ');
          throw new Error(messages);
        }
        throw new Error(error.detail || 'Registration failed');
      }
      
      return response.json();
    } catch (error) {
      // If it's a network error, provide more details
      if (error.message === 'Failed to fetch' || !error.message) {
        throw new Error('Failed to fetch');
      }
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    const data = await response.json();
    // Store token in localStorage
    localStorage.setItem('token', data.access_token);
    return data;
  },

  // Get current user info
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }
    
    return response.json();
  },

  // Update current user info
  updateCurrentUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update user');
    }
    
    return response.json();
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  }
};

// Pitches API
export const pitchesAPI = {
  // Get all user pitches
  getAllPitches: async () => {
    const response = await fetch(`${API_BASE_URL}/pitches/`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch pitches');
    }
    
    return response.json();
  },

  // Get single pitch by ID
  getPitch: async (pitchId) => {
    const response = await fetch(`${API_BASE_URL}/pitches/${pitchId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch pitch');
    }
    
    return response.json();
  },

  // Create new pitch
  createPitch: async (pitchData) => {
    const response = await fetch(`${API_BASE_URL}/pitches/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pitchData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create pitch');
    }
    
    return response.json();
  },

  // Update pitch
  updatePitch: async (pitchId, pitchData) => {
    const response = await fetch(`${API_BASE_URL}/pitches/${pitchId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(pitchData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update pitch');
    }
    
    return response.json();
  },

  // Delete pitch
  deletePitch: async (pitchId) => {
    const response = await fetch(`${API_BASE_URL}/pitches/${pitchId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete pitch');
    }
    
    return true;
  },

  // Upload audio file
  uploadAudio: async (pitchId, audioFile) => {
    const formData = new FormData();
    formData.append('file', audioFile);
    
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pitches/${pitchId}/upload-audio`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload audio');
    }
    
    return response.json();
  },

  // Upload video file
  uploadVideo: async (pitchId, videoFile) => {
    const formData = new FormData();
    formData.append('file', videoFile);
    
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pitches/${pitchId}/upload-video`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload video');
    }
    
    return response.json();
  },

  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/pitches/analytics/dashboard`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    
    return response.json();
  }
};

export default { authAPI, pitchesAPI };
