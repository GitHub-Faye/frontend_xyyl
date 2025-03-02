import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  TimePicker, 
  InputNumber, 
  Card,
  message, 
  Row, 
  Col,
  Select
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { createHealthRecord, getHealthRecord, updateHealthRecord } from '../services/healthRecords';
import type { HealthRecord } from '../services/healthRecords';

// 扩展的健康记录类型，包含表单可能需要的额外字段
interface ExtendedHealthRecord extends HealthRecord {
  record_date?: string;
  height?: number;
  blood_glucose?: number;
  mood?: string;
}

const { Option } = Select;
const { TextArea } = Input;

const moodOptions = [
  '愉快', '平静', '疲劳', '焦虑', '压力大', '悲伤', '兴奋', '烦躁'
];

const HealthRecordForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<ExtendedHealthRecord | null>(null);
  
  const isEdit = !!id;
  
  // 如果是编辑模式，获取记录详情
  useEffect(() => {
    const fetchRecord = async () => {
      if (!isEdit) return;
      
      try {
        setLoading(true);
        console.log(`获取健康记录详情，ID: ${id}`);
        const data = await getHealthRecord(Number(id));
        console.log('获取到的健康记录详情:', data);
        
        // 将数据转换为表单可用的格式
        const formattedData = {
          ...data,
          record_date: data.record_date ? dayjs(data.record_date) : undefined,
          record_time: data.record_time ? dayjs(data.record_time, 'HH:mm') : undefined
        };
        
        setInitialValues(formattedData);
        form.setFieldsValue(formattedData);
      } catch (error) {
        console.error('获取健康记录详情失败', error);
        message.error('获取记录详情失败，请重试');
        navigate('/health-records');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecord();
  }, [id, isEdit, form, navigate]);
  
  // 表单提交处理
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // 处理日期和时间
      const record: ExtendedHealthRecord = {
        ...values,
        record_date: values.record_date ? values.record_date.format('YYYY-MM-DD') : undefined,
        record_time: values.record_time ? values.record_time.format('HH:mm') : undefined
      };
      
      console.log('提交健康记录表单:', record);
      
      if (isEdit) {
        await updateHealthRecord(Number(id), record);
        message.success('健康记录更新成功');
      } else {
        await createHealthRecord(record);
        message.success('健康记录创建成功');
      }
      
      navigate('/health-records');
    } catch (error: any) {
      console.error('保存健康记录失败', error);
      const errorMsg = error.response?.data?.detail || '保存失败，请重试';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  // 取消操作
  const handleCancel = () => {
    navigate('/health-records');
  };
  
  return (
    <Card
      title={isEdit ? '编辑健康记录' : '新增健康记录'}
      bordered={false}
      extra={
        <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
          返回
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          ...initialValues,
          record_date: dayjs(),
          record_time: dayjs()
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="record_date"
              label="记录日期"
              rules={[{ required: true, message: '请选择日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="record_time"
              label="记录时间"
              rules={[{ required: true, message: '请选择时间' }]}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="weight"
              label="体重 (kg)"
              rules={[
                { 
                  type: 'number', 
                  min: 10, 
                  max: 300, 
                  message: '体重范围应在10kg至300kg之间' 
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入体重" precision={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="height"
              label="身高 (cm)"
              rules={[
                { 
                  type: 'number', 
                  min: 50, 
                  max: 250, 
                  message: '身高范围应在50cm至250cm之间' 
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入身高" precision={1} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="systolic_pressure"
              label="收缩压 (mmHg)"
              rules={[
                { 
                  type: 'number', 
                  min: 70, 
                  max: 220, 
                  message: '收缩压范围应在70mmHg至220mmHg之间' 
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入收缩压" precision={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="diastolic_pressure"
              label="舒张压 (mmHg)"
              rules={[
                { 
                  type: 'number', 
                  min: 40, 
                  max: 140, 
                  message: '舒张压范围应在40mmHg至140mmHg之间' 
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入舒张压" precision={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="heart_rate"
              label="心率 (次/分钟)"
              rules={[
                { 
                  type: 'number', 
                  min: 40, 
                  max: 200, 
                  message: '心率范围应在40-200次/分钟之间' 
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入心率" precision={0} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="blood_glucose"
              label="血糖 (mmol/L)"
              rules={[
                { 
                  type: 'number', 
                  min: 2, 
                  max: 30, 
                  message: '血糖范围应在2-30mmol/L之间' 
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入血糖" precision={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mood"
              label="状态"
            >
              <Select placeholder="请选择当前状态">
                {moodOptions.map(mood => (
                  <Option key={mood} value={mood}>{mood}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="notes"
          label="备注"
        >
          <TextArea rows={4} placeholder="请输入备注信息" />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            icon={<SaveOutlined />}
            style={{ marginRight: 16 }}
          >
            保存
          </Button>
          <Button onClick={handleCancel}>取消</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default HealthRecordForm; 