import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token, email: localStorage.getItem('email') });
    }
  }, []);

  const login = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    setUser({ token, email });
    navigate('/main');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}