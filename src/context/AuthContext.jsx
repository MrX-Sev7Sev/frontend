import { createContext, useContext, useState, useEffect } from 'react';
import { UsersAPI } from '../api/users';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await UsersAPI.getProfile();
        setUser(profile);
      } catch (error) {
        setUser(null);  // Тут можно добавить логирование console.error(error)
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const register = async (email, password, username) => {
    try {
      const data = await UsersAPI.register(username, email, password);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await UsersAPI.login(email, password);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
