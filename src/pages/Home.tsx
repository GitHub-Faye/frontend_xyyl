import React, { useCallback } from 'react';
import { Card, Row, Col, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HeartOutlined,
  UserOutlined,
  BarChartOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { ROUTES } from '../config/routes';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 使用useCallback包装导航函数，直接使用路由配置
  const handleNavigate = useCallback((routePath: string) => {
    console.log('尝试导航到:', routePath);
    
    try {
      navigate(routePath);
    } catch (error) {
      console.error('导航错误:', error);
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="hero-section" style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '20px 0' }}>小艺医疗健康管理系统</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', margin: '0 auto' }}>
          专业的个人健康数据管理平台，帮助您监测身体状况，记录健康数据，实时掌握健康动态。
        </p>
        
        {!isAuthenticated && (
          <div style={{ margin: '30px 0' }}>
            <Link to={ROUTES.LOGIN}>
              <Button type="primary" size="large" style={{ marginRight: '15px' }}>
                登录系统
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button size="large">注册账号</Button>
            </Link>
          </div>
        )}
      </div>
      
      <Row gutter={[24, 24]} style={{ marginTop: '40px' }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            cover={
              <div style={{ padding: '30px 0', textAlign: 'center', background: '#f9f9f9' }}>
                <HeartOutlined style={{ fontSize: '40px', color: '#ff4d4f' }} />
              </div>
            }
            actions={[
              <Button type="link" onClick={() => handleNavigate(ROUTES.HEALTH_RECORDS)}>
                查看详情
              </Button>
            ]}
          >
            <Card.Meta
              title="健康记录"
              description="记录和管理您的日常健康数据，包括血压、心率、体重等关键指标。"
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            cover={
              <div style={{ padding: '30px 0', textAlign: 'center', background: '#f9f9f9' }}>
                <BarChartOutlined style={{ fontSize: '40px', color: '#1890ff' }} />
              </div>
            }
            actions={[
              <Button type="link" onClick={() => handleNavigate(ROUTES.HEALTH_STATISTICS)}>
                查看详情
              </Button>
            ]}
          >
            <Card.Meta
              title="健康统计"
              description="通过图表直观展示您的健康趋势，帮助您更好地了解身体状况变化。"
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            cover={
              <div style={{ padding: '30px 0', textAlign: 'center', background: '#f9f9f9' }}>
                <UserOutlined style={{ fontSize: '40px', color: '#52c41a' }} />
              </div>
            }
            actions={[
              <Button type="link" onClick={() => handleNavigate(ROUTES.PROFILE)}>
                查看详情
              </Button>
            ]}
          >
            <Card.Meta
              title="个人信息"
              description="管理您的个人资料和账户设置，确保信息安全和及时更新。"
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            cover={
              <div style={{ padding: '30px 0', textAlign: 'center', background: '#f9f9f9' }}>
                <MedicineBoxOutlined style={{ fontSize: '40px', color: '#722ed1' }} />
              </div>
            }
            actions={[
              <Button type="link" onClick={() => handleNavigate(ROUTES.HEALTH_RECORD_NEW)}>
                查看详情
              </Button>
            ]}
          >
            <Card.Meta
              title="新增记录"
              description="快速添加新的健康记录，确保您的健康数据持续更新。"
            />
          </Card>
        </Col>
      </Row>
      
      <div style={{ margin: '50px 0', textAlign: 'center' }}>
        <h2>健康管理从这里开始</h2>
        <p style={{ color: '#666', maxWidth: '700px', margin: '20px auto' }}>
          小艺医疗健康管理系统帮助您全面掌握自身健康状况，通过数据分析提供健康趋势和建议，让健康管理更加科学、便捷。
        </p>
      </div>
    </div>
  );
}; 