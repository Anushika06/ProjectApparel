import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, login as apiLogin, signup as apiSignup, logout as apiLogout } from '../api/auth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Checks session on app load

  useEffect(() => {
    // Check for an existing session on app load
    const checkUserSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log("No active session");
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = async (email, password) => {
    const userData = await apiLogin(email, password);
    setUser(userData);
    setIsLoggedIn(true);
    return userData;
  };

  const signup = async (name, email, password) => {
    const userData = await apiSignup(name, email, password);
    setUser(userData);
    setIsLoggedIn(true);
    return userData;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <LoadingSpinner />; // Show loader while checking session
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access auth context
export const useAuth = () => {
  return useContext(AuthContext);
};