import React from 'react';
import { Layout } from 'antd';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const { Content, Sider } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        {isAuthenticated && (
          <Sider width={200} theme="light" breakpoint="lg" collapsible>
            <Sidebar />
          </Sider>
        )}
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
              borderRadius: 4,
            }}
          >
            {children}
          </Content>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            © 2024 小艺医疗. All rights reserved.
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
} 