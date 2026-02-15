import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { authApi } from '@/services/api';
import type { User } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch user profile
  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getProfile();
      // Backend returns: { success: true, data: { id, name, email, ... } }
      setUser({
        id: res.data.data.id,
        name: res.data.data.name,
        email: res.data.data.email,
        avatar: res.data.data.avatar,
        role: res.data.data.role,
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  }, []);

  // 🔹 Restore auth on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await refreshUser();
      }
      setLoading(false);
    };
    
    initAuth();
  }, [refreshUser]);

  // 🔹 Login
  const login = useCallback(async (email: string, password: string) => {
  const res = await authApi.login(email, password);
  
  const userData = {
    id: res.data.data.user.id,
    name: res.data.data.user.name,
    email: res.data.data.user.email,
    avatar: res.data.data.user.avatar,
    role: res.data.data.user.role,
  };
    
    // Backend returns: 
    // {
    //   success: true,
    //   data: {
    //     user: { id, name, email, ... },
    //     accessToken: "...",
    //     refreshToken: "..."
    //   }
    // }
    
    // The axios interceptor already stores the tokens automatically
    // So we just need to set the user
  //   setUser({
  //     id: res.data.data.user.id,
  //     name: res.data.data.user.name,
  //     email: res.data.data.user.email,
  //     avatar: res.data.data.user.avatar,
  //     role: res.data.data.user.role,
  //   });
  // }, []);
   localStorage.setItem('user', JSON.stringify(userData));
  
  // The tokens are already stored by the axios interceptor
  setUser(userData);
}, []);

  // 🔹 Logout
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}