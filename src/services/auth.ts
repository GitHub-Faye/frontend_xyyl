import axios from 'axios';

// 使用正确的环境变量
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login/`, data);
    return response.data;
  },

  async register(data: RegisterData): Promise<void> {
    await axios.post(`${API_URL}/users/`, data);
  },

  async resetPassword(email: string): Promise<void> {
    await axios.post(`${API_URL}/users/request_password_reset/`, { email });
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/refresh/`, {
      refresh: refreshToken
    });
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/auth/logout/`, 
          { refresh: refreshToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // 无论API调用是否成功，都清除本地存储的token
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }
}; 