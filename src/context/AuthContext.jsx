import { createContext, useContext, useState, useEffect } from 'react';
import { UsersAPI } from '../api/users';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверка авторизации при загрузке приложения
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await UsersAPI.getProfile();
        setUser(profile);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Регистрация
  const register = async (email, password, username) => {
    const data = await UsersAPI.register(username, email, password);
    setUser(data.user);
  };

  // Авторизация
  const login = async (email, password) => {
    const data = await UsersAPI.login(email, password);
    setUser(data.user);
  };

  // Выход
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Обновление профиля
  const updateProfile = async (profileData) => {
    const updatedProfile = await UsersAPI.updateProfile(profileData);
    setUser(updatedProfile);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
