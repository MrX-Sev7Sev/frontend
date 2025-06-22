import api from './api';

export const UsersAPI = {
  register: async (username, email, password) => {
    const response = await api.post("/auth/register", {  // Было /auth/signup
      username,
      email,
      password,
    });
    localStorage.setItem("token", response.data.access_token);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post("/auth/login", {  
      email,
      password,
    });
    localStorage.setItem("token", response.data.access_token);
    return response.data;
  },

  getProfile: async () => {
    const token = localStorage.getItem("token");  
    try {
      const response = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` }  // Добавляем заголовок
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

};
