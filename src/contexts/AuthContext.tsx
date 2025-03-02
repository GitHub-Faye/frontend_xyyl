import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/auth';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  // 检查令牌是否过期
  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    // 检查本地存储的token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        if (isTokenExpired(token)) {
          // token过期，尝试使用refreshToken刷新
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            authService.refreshToken(refreshToken)
              .then(response => {
                localStorage.setItem('token', response.access);
                const decoded = jwtDecode(response.access);
                setUser(decoded);
                setIsAuthenticated(true);
              })
              .catch(err => {
                console.error('令牌刷新失败：', err);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                setIsAuthenticated(false);
                setUser(null);
              });
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // 令牌未过期
          const decoded = jwtDecode(token);
          setUser(decoded);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('无效令牌:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        setUser(null);
      }
    }

    // 设置拦截器处理401响应
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response && error.response.status === 401) {
          const originalRequest = error.config;
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
              const refreshToken = localStorage.getItem('refreshToken');
              if (refreshToken) {
                const res = await authService.refreshToken(refreshToken);
                localStorage.setItem('token', res.access);
                
                // 更新请求头并重试
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.access}`;
                originalRequest.headers['Authorization'] = `Bearer ${res.access}`;
                return axios(originalRequest);
              }
            } catch (refreshError) {
              console.error('令牌刷新失败，需要重新登录:', refreshError);
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              setIsAuthenticated(false);
              setUser(null);
              return Promise.reject(refreshError);
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      localStorage.setItem('token', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      
      // 设置全局请求头
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.access}`;
      
      const decoded = jwtDecode(response.access);
      setUser(decoded);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      // 清除全局请求头
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    await authService.register({ username, email, password });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 