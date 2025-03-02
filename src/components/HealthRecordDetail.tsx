import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Spin, Alert, Result } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getHealthRecord } from '../services/healthRecords';
import type { HealthRecord } from '../services/healthRecords';
import dayjs from 'dayjs';

// 扩展的健康记录类型，包含后端可能返回的其他字段
interface ExtendedHealthRecord extends HealthRecord {
  record_date?: string;
  height?: number;
  blood_glucose?: number;
  mood?: string;
}

const HealthRecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<ExtendedHealthRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 获取健康记录详情
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          setError('记录ID无效');
          return;
        }
        
        console.log(`获取健康记录详情，ID: ${id}`);
        const data = await getHealthRecord(Number(id));
        console.log('获取到的健康记录详情:', data);
        setRecord(data);
      } catch (error: any) {
        console.error('获取健康记录详情失败', error);
        const errorMsg = error.response?.data?.detail || '获取记录详情失败，请重试';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  // 返回列表
  const handleBack = () => {
    navigate('/health-records');
  };

  // 编辑记录
  const handleEdit = () => {
    navigate(`/health-records/edit/${id}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="获取健康记录失败"
        subTitle={error}
        extra={
          <Button type="primary" onClick={handleBack}>
            返回列表
          </Button>
        }
      />
    );
  }

  if (!record) {
    return (
      <Result
        status="warning"
        title="记录不存在"
        extra={
          <Button type="primary" onClick={handleBack}>
            返回列表
          </Button>
        }
      />
    );
  }

  // 格式化日期，如果record_date不存在则使用当前日期
  const formattedDate = record.record_date 
    ? dayjs(record.record_date).format('YYYY-MM-DD')
    : '未记录';

  return (
    <Card
      title="健康记录详情"
      extra={
        <div>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack} 
            style={{ marginRight: 8 }}
          >
            返回
          </Button>
          <Button type="primary" onClick={handleEdit}>
            编辑
          </Button>
        </div>
      }
      bordered={false}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="记录日期">
          {formattedDate}
        </Descriptions.Item>
        <Descriptions.Item label="记录时间">
          {record.record_time}
        </Descriptions.Item>
        <Descriptions.Item label="体重">
          {record.weight ? `${record.weight} kg` : '未记录'}
        </Descriptions.Item>
        <Descriptions.Item label="身高">
          {record.height ? `${record.height} cm` : '未记录'}
        </Descriptions.Item>
        <Descriptions.Item label="血压">
          {record.systolic_pressure && record.diastolic_pressure 
            ? `${record.systolic_pressure}/${record.diastolic_pressure} mmHg` 
            : '未记录'}
        </Descriptions.Item>
        <Descriptions.Item label="心率">
          {record.heart_rate ? `${record.heart_rate} 次/分钟` : '未记录'}
        </Descriptions.Item>
        <Descriptions.Item label="血糖">
          {record.blood_glucose ? `${record.blood_glucose} mmol/L` : '未记录'}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          {record.mood || '未记录'}
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          {record.notes || '无'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default HealthRecordDetail;