import api from './api';

export const UsersAPI = {
  register: async (username, email, password) => {
    const response = await api.post('/auth/signup', { username, email, password });
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

  // Обновление профиля пользователя
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/me', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
