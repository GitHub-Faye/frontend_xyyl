import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Tabs, 
  Divider, 
  message, 
  Descriptions, 
  Avatar,
  Space
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  PhoneOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
      });
    }
  }, [user, form]);

  const handleUpdateProfile = async (values: UserProfile) => {
    try {
      setLoading(true);
      
      // 这里会调用更新用户信息的API
      // 目前模拟更新成功
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('个人信息更新成功');
    } catch (error) {
      console.error('更新个人信息失败', error);
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理密码变更
  const handleChangePassword = async (values: any) => {
    try {
      setLoading(true);
      
      // 这里会调用更改密码的API
      // 目前模拟更新成功
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('密码更新成功');
      
      // 重置表单
      form.resetFields(['oldPassword', 'newPassword', 'confirmPassword']);
    } catch (error) {
      console.error('更改密码失败', error);
      message.error('密码更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="个人信息管理" bordered={false}>
      <Tabs defaultActiveKey="profile">
        <Tabs.TabPane tab="个人资料" key="profile">
          <div style={{ display: 'flex', marginBottom: 24 }}>
            <Avatar 
              size={64} 
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#1890ff', marginRight: 16 }}
            />
            <div>
              <h2 style={{ margin: '0 0 8px 0' }}>{user?.username || '用户名'}</h2>
              <p style={{ color: '#666' }}>{user?.email || '电子邮箱'}</p>
            </div>
          </div>
          
          <Divider />
          
          <Descriptions title="账户信息" bordered column={1}>
            <Descriptions.Item label="用户名">{user?.username || '-'}</Descriptions.Item>
            <Descriptions.Item label="电子邮箱">{user?.email || '-'}</Descriptions.Item>
            <Descriptions.Item label="姓名">
              {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">{user?.phone_number || '-'}</Descriptions.Item>
          </Descriptions>
          
          <Divider />
          
          <h3>更新个人信息</h3>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
          >
            <Form.Item
              name="first_name"
              label="名"
            >
              <Input prefix={<UserOutlined />} placeholder="请输入名" />
            </Form.Item>
            
            <Form.Item
              name="last_name"
              label="姓"
            >
              <Input prefix={<UserOutlined />} placeholder="请输入姓" />
            </Form.Item>
            
            <Form.Item
              name="phone_number"
              label="联系电话"
              rules={[
                { 
                  pattern: /^1[3-9]\d{9}$/, 
                  message: '请输入有效的手机号码' 
                }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="请输入手机号码" />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="电子邮箱"
              rules={[
                { type: 'email', message: '请输入有效的电子邮箱' },
                { required: true, message: '请输入电子邮箱' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="请输入电子邮箱" />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
              >
                保存信息
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab="修改密码" key="password">
          <Form
            layout="vertical"
            onFinish={handleChangePassword}
          >
            <Form.Item
              name="oldPassword"
              label="当前密码"
              rules={[{ required: true, message: '请输入当前密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请输入当前密码" />
            </Form.Item>
            
            <Form.Item
              name="newPassword"
              label="新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 8, message: '密码长度至少为8位' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请输入新密码" />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
              label="确认新密码"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                })
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请再次输入新密码" />
            </Form.Item>
            
            <Form.Item>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                >
                  更新密码
                </Button>
                <Button 
                  onClick={() => form.resetFields(['oldPassword', 'newPassword', 'confirmPassword'])}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
}; 