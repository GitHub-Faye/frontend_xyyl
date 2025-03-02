import React, { useEffect } from 'react';
import { Tabs, Button, Card, message } from 'antd';
import { PlusOutlined, BarChartOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import HealthRecordList from '../components/HealthRecordList';
import HealthStatistics from '../components/HealthStatistics';
import { ROUTES } from '../config/routes';

const HealthRecords: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 添加调试日志，在组件加载时输出
  useEffect(() => {
    console.log('HealthRecords组件已加载，当前路径:', location.pathname);
    
    // 检查认证状态
    const token = localStorage.getItem('token');
    console.log('当前认证状态:', token ? '已登录' : '未登录');
  }, [location]);
  
  // 处理添加记录
  const handleAddRecord = () => {
    console.log('点击添加记录按钮');
    navigate(ROUTES.HEALTH_RECORD_NEW);
  };
  
  // 确定当前激活的标签页
  const getActiveTabKey = () => {
    if (location.pathname.includes(ROUTES.HEALTH_STATISTICS)) {
      return 'statistics';
    }
    return 'records';
  };
  
  // 处理标签页切换
  const handleTabChange = (key: string) => {
    console.log('切换标签页到:', key);
    if (key === 'statistics') {
      navigate(ROUTES.HEALTH_STATISTICS);
    } else {
      navigate(ROUTES.HEALTH_RECORDS);
    }
  };
  
  // 使用try-catch包装组件渲染，防止错误导致整个组件崩溃
  try {
    return (
      <Card
        title="健康数据管理"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddRecord}
          >
            添加记录
          </Button>
        }
        variant="borderless"
      >
        <Tabs
          activeKey={getActiveTabKey()}
          onChange={handleTabChange}
          items={[
            {
              key: 'records',
              label: (
                <span>
                  <UnorderedListOutlined />
                  健康记录
                </span>
              ),
              children: <HealthRecordList />
            },
            {
              key: 'statistics',
              label: (
                <span>
                  <BarChartOutlined />
                  数据统计
                </span>
              ),
              children: <HealthStatistics />
            }
          ]}
        />
      </Card>
    );
  } catch (error) {
    console.error('HealthRecords组件渲染错误:', error);
    message.error('加载健康记录页面时发生错误');
    return <div>加载健康记录页面时发生错误，请刷新页面重试</div>;
  }
};

export default HealthRecords;