/**
 * 应用路由配置
 * 集中管理所有路由路径，避免硬编码
 */

export const ROUTES = {
  // 公共路由
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // 用户中心
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  SETTINGS: '/settings',
  
  // 健康记录
  HEALTH_RECORDS: '/react-health-records',
  HEALTH_RECORD_NEW: '/react-health-records/new',
  HEALTH_RECORD_DETAIL: (id: number) => `/react-health-records/${id}`,
  HEALTH_RECORD_EDIT: (id: number) => `/react-health-records/edit/${id}`,
  HEALTH_STATISTICS: '/react-health-statistics',
  
  // 预约管理
  APPOINTMENTS: '/appointments',
}; 