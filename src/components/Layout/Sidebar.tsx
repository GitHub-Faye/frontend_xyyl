import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  HomeOutlined,
  HeartOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../config/routes';

type MenuItem = Required<MenuProps>['items'][number];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // 如果未登录，不显示侧边栏
  if (!isAuthenticated) {
    return null;
  }

  // 定义菜单项
  const items: MenuItem[] = [
    {
      key: ROUTES.HOME,
      icon: <HomeOutlined />,
      label: <Link to={ROUTES.HOME}>首页</Link>,
    },
    {
      key: 'health',
      icon: <HeartOutlined />,
      label: '健康管理',
      children: [
        {
          key: ROUTES.HEALTH_RECORDS,
          label: <Link to={ROUTES.HEALTH_RECORDS}>生理信息管理</Link>,
        },
        // 未来可以在这里添加更多健康管理相关功能
      ],
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '用户中心',
      children: [
        {
          key: ROUTES.PROFILE,
          label: <Link to={ROUTES.PROFILE}>个人资料</Link>,
        },
        {
          key: ROUTES.CHANGE_PASSWORD,
          label: <Link to={ROUTES.CHANGE_PASSWORD}>修改密码</Link>,
        },
      ],
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: '预约管理',
      children: [
        {
          key: ROUTES.APPOINTMENTS,
          label: <Link to={ROUTES.APPOINTMENTS}>我的预约</Link>,
        },
      ],
    },
    {
      key: ROUTES.SETTINGS,
      icon: <SettingOutlined />,
      label: <Link to={ROUTES.SETTINGS}>系统设置</Link>,
    },
  ];
  
  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ height: '100%', borderRight: 0 }}
      items={items}
    />
  );
}; 