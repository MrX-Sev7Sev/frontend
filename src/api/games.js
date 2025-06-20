import api from './api';

export const GamesAPI = {
  // Получение всех игр
  getAll: async () => {
    try {
      const response = await api.get('/games');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Создание новой игры
  create: async (gameData) => {
    try {
      const response = await api.post('/games', gameData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Присоединение к игре
  join: async (gameId) => {
    try {
      const response = await api.post(`/games/${gameId}/join`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Удаление игры
  delete: async (gameId) => {
    try {
      const response = await api.delete(`/games/${gameId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
