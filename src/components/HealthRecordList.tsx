import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, DatePicker, Row, Col, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { HealthRecord } from '../services/healthRecords';
import { getHealthRecords, deleteHealthRecord } from '../services/healthRecords';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ROUTES } from '../config/routes';

const { RangePicker } = DatePicker;

const HealthRecordList: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [error, setError] = useState<string | null>(null);
  
  // 加载健康记录数据
  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      let startDate, endDate;
      
      if (dateRange[0] && dateRange[1]) {
        startDate = dateRange[0].format('YYYY-MM-DD');
        endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      const data = await getHealthRecords(startDate, endDate);
      console.log('健康记录数据:', data);
      setRecords(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('获取健康记录失败', error);
      const errorMsg = error.response?.data?.detail || '获取健康记录失败，请检查网络连接或登录状态';
      setError(errorMsg);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    fetchRecords();
  }, []);
  
  // 日期范围变化时重新加载数据
  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
    setDateRange(dates);
    setTimeout(fetchRecords, 0);
  };
  
  // 查看记录详情
  const handleViewRecord = (id: number) => {
    navigate(ROUTES.HEALTH_RECORD_DETAIL(id));
  };
  
  // 编辑记录
  const handleEditRecord = (id: number) => {
    navigate(ROUTES.HEALTH_RECORD_EDIT(id));
  };
  
  // 添加新记录
  const handleAddRecord = () => {
    navigate(ROUTES.HEALTH_RECORD_NEW);
  };
  
  // 删除记录
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteHealthRecord(id);
      message.success('记录已删除');
      fetchRecords();
    } catch (error: any) {
      console.error('删除健康记录失败', error);
      const errorMsg = error.response?.data?.detail || '删除失败，请重试';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  // 表格列定义
  const columns = [
    {
      title: '记录时间',
      dataIndex: 'record_time',
      key: 'record_time',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a: HealthRecord, b: HealthRecord) => 
        dayjs(a.record_time).valueOf() - dayjs(b.record_time).valueOf(),
    },
    {
      title: '体重 (kg)',
      dataIndex: 'weight',
      key: 'weight',
      render: (text: any) => {
        if (text !== null && text !== undefined && typeof text === 'number') {
          return text.toFixed(1);
        }
        return '-';
      },
    },
    {
      title: '血压 (mmHg)',
      key: 'blood_pressure',
      render: (_: any, record: HealthRecord) => {
        if (record.systolic_pressure && record.diastolic_pressure) {
          return `${record.systolic_pressure}/${record.diastolic_pressure}`;
        }
        return '-';
      },
    },
    {
      title: '心率 (次/分钟)',
      dataIndex: 'heart_rate',
      key: 'heart_rate',
      render: (text: number) => text || '-',
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: HealthRecord) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewRecord(record.id!)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEditRecord(record.id!)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此记录吗?"
            onConfirm={() => handleDelete(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  return (
    <Card 
      title="健康记录列表" 
      variant="borderless"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRecord}>
          添加记录
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <RangePicker 
              onChange={handleDateRangeChange as any}
              style={{ marginBottom: 16 }}
              allowClear
              placeholder={['开始日期', '结束日期']}
            />
            
            {error && (
              <Alert 
                message="加载错误" 
                description={error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            
            <Table 
              columns={columns} 
              dataSource={records} 
              rowKey="id"
              loading={loading}
              pagination={{ 
                pageSize: 10, 
                showSizeChanger: true, 
                showTotal: (total) => `共 ${total} 条记录` 
              }}
              locale={{
                emptyText: error ? '加载失败' : '暂无数据'
              }}
            />
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default HealthRecordList; 