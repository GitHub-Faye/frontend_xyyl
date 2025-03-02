import axios, { AxiosError } from 'axios';

// 健康记录类型定义
export interface HealthRecord {
  id?: number;
  user?: number;
  weight?: number;
  systolic_pressure?: number;
  diastolic_pressure?: number;
  heart_rate?: number;
  record_time: string;
  notes?: string;
}

// 统计数据类型定义
export interface HealthStatistics {
  weight_avg?: number;
  systolic_pressure_avg?: number;
  diastolic_pressure_avg?: number;
  heart_rate_avg?: number;
  weight_trend?: {date: string, value: number}[];
  blood_pressure_trend?: {date: string, systolic: number, diastolic: number}[];
  heart_rate_trend?: {date: string, value: number}[];
}

// API错误类型定义
export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

// 使用正确的环境变量
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// 错误处理工具函数
const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{detail?: string, message?: string}>;
    return {
      status: axiosError.response?.status || 500,
      message: axiosError.response?.data?.detail || 
               axiosError.response?.data?.message ||
               axiosError.message || 
               '服务器错误',
      data: axiosError.response?.data
    };
  }
  
  return {
    status: 500,
    message: error.message || '发生未知错误',
  };
};

// 请求工具封装
const api = {
  async get(url: string, params?: any) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  async post(url: string, data: any) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  async put(url: string, data: any) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(url, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  async delete(url: string) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// 创建健康记录
export const createHealthRecord = async (data: HealthRecord) => {
  try {
    return await api.post(`${API_URL}/health-records/`, data);
  } catch (error) {
    console.error('创建健康记录失败', error);
    throw error;
  }
};

// 获取健康记录列表
export const getHealthRecords = async (startDate?: string, endDate?: string) => {
  try {
    const params: Record<string, string> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    return await api.get(`${API_URL}/health-records/`, params);
  } catch (error) {
    console.error('获取健康记录列表失败', error);
    throw error;
  }
};

// 获取单条健康记录
export const getHealthRecord = async (id: number) => {
  try {
    return await api.get(`${API_URL}/health-records/${id}/`);
  } catch (error) {
    console.error('获取健康记录详情失败', error);
    throw error;
  }
};

// 更新健康记录
export const updateHealthRecord = async (id: number, data: HealthRecord) => {
  try {
    return await api.put(`${API_URL}/health-records/${id}/`, data);
  } catch (error) {
    console.error('更新健康记录失败', error);
    throw error;
  }
};

// 删除健康记录
export const deleteHealthRecord = async (id: number) => {
  try {
    await api.delete(`${API_URL}/health-records/${id}/`);
    return true;
  } catch (error) {
    console.error('删除健康记录失败', error);
    throw error;
  }
};

// 获取健康统计数据
export const getHealthStatistics = async (startDate?: string, endDate?: string) => {
  try {
    console.log(`调用统计API，参数: startDate=${startDate}, endDate=${endDate}`);
    const params: Record<string, string> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    // 记录请求URL
    const requestUrl = `${API_URL}/health-records/statistics/`;
    console.log(`发送请求到: ${requestUrl}，参数:`, params);
    
    const response = await api.get(requestUrl, params);
    console.log('获取到的原始统计数据:', response);
    
    // 确保返回数据结构完整
    const defaultStats: HealthStatistics = {
      weight_avg: 0,
      systolic_pressure_avg: 0,
      diastolic_pressure_avg: 0,
      heart_rate_avg: 0,
      weight_trend: [],
      blood_pressure_trend: [],
      heart_rate_trend: []
    };
    
    return { ...defaultStats, ...response };
  } catch (error) {
    console.error('获取健康统计数据失败', error);
    throw error;
  }
}; 