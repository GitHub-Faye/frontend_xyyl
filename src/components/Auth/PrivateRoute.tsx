import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('PrivateRoute被访问，路径:', location.pathname);
    console.log('认证状态:', isAuthenticated);
    
    const token = localStorage.getItem('token');
    console.log('本地Token存在:', !!token);
    
    if (!isAuthenticated && token) {
      console.warn('认证状态与Token不匹配，可能存在认证问题');
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    console.log('未认证，重定向到登录页面', location);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('用户已认证，正在渲染受保护内容');
  return children;
} 