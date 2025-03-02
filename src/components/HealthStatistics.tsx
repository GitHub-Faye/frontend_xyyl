import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Row, Col, Statistic, Spin, Empty, Alert, Tabs, message } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getHealthStatistics } from '../services/healthRecords';
import type { HealthStatistics as HealthStatsType } from '../services/healthRecords';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface ChartDataItem {
  date: string;
  weight?: number;
  systolic?: number;
  diastolic?: number;
  heart_rate?: number;
}

const HealthStatistics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<HealthStatsType | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [error, setError] = useState<string | null>(null);
  
  // 将后端返回的趋势数据转换为图表所需的格式
  const prepareChartData = (): ChartDataItem[] => {
    if (!statistics) {
      console.log('没有统计数据可用');
      return [];
    }
    
    console.log('准备图表数据，原始数据:', JSON.stringify(statistics));
    
    // 创建日期映射的数据字典
    const dataMap: Record<string, ChartDataItem> = {};
    
    // 检查并处理体重数据
    if (statistics.weight_trend && statistics.weight_trend.length > 0) {
      console.log(`处理 ${statistics.weight_trend.length} 条体重趋势数据`);
      statistics.weight_trend.forEach(item => {
        const formattedDate = dayjs(item.date).format('MM-DD');
        if (!dataMap[formattedDate]) {
          dataMap[formattedDate] = { date: formattedDate };
        }
        dataMap[formattedDate].weight = item.value;
      });
    } else {
      console.log('没有体重趋势数据');
    }
    
    // 检查并处理血压数据
    if (statistics.blood_pressure_trend && statistics.blood_pressure_trend.length > 0) {
      console.log(`处理 ${statistics.blood_pressure_trend.length} 条血压趋势数据`);
      statistics.blood_pressure_trend.forEach(item => {
        const formattedDate = dayjs(item.date).format('MM-DD');
        if (!dataMap[formattedDate]) {
          dataMap[formattedDate] = { date: formattedDate };
        }
        dataMap[formattedDate].systolic = item.systolic;
        dataMap[formattedDate].diastolic = item.diastolic;
      });
    } else {
      console.log('没有血压趋势数据');
    }
    
    // 检查并处理心率数据
    if (statistics.heart_rate_trend && statistics.heart_rate_trend.length > 0) {
      console.log(`处理 ${statistics.heart_rate_trend.length} 条心率趋势数据`);
      statistics.heart_rate_trend.forEach(item => {
        const formattedDate = dayjs(item.date).format('MM-DD');
        if (!dataMap[formattedDate]) {
          dataMap[formattedDate] = { date: formattedDate };
        }
        dataMap[formattedDate].heart_rate = item.value;
      });
    } else {
      console.log('没有心率趋势数据');
    }
    
    // 将数据字典转换为数组并按日期排序
    const result = Object.values(dataMap).sort((a, b) => 
      dayjs(`2023-${a.date}`).valueOf() - dayjs(`2023-${b.date}`).valueOf()
    );
    
    console.log(`图表数据处理完成，共 ${result.length} 条数据点:`, result);
    return result;
  };
  
  // 加载统计数据
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      
      console.log(`获取统计数据，日期范围: ${startDate} 至 ${endDate}`);
      
      const data = await getHealthStatistics(startDate, endDate);
      console.log('获取到的统计数据:', data);
      
      if (!data) {
        throw new Error('没有返回数据');
      }
      
      // 检查数据结构是否正确
      if (typeof data !== 'object') {
        console.error('返回的数据不是对象:', data);
        throw new Error('返回的数据格式不正确');
      }
      
      // 兼容处理：如果返回的是旧格式数据，转换为新格式
      let compatibleData = { ...data };
      
      // 如果有旧的数据格式，进行转换
      if (data.weight && typeof data.weight === 'object' && data.weight.avg !== undefined) {
        console.log('检测到旧的数据格式，进行转换');
        compatibleData = {
          ...compatibleData,
          weight_avg: data.weight.avg,
          systolic_pressure_avg: data.systolic_pressure?.avg || 0,
          diastolic_pressure_avg: data.diastolic_pressure?.avg || 0,
          heart_rate_avg: data.heart_rate?.avg || 0,
          // 确保趋势数据存在
          weight_trend: compatibleData.weight_trend || [],
          blood_pressure_trend: compatibleData.blood_pressure_trend || [],
          heart_rate_trend: compatibleData.heart_rate_trend || []
        };
      }
      
      // 确保每个趋势数组都有值
      if (!compatibleData.weight_trend) compatibleData.weight_trend = [];
      if (!compatibleData.blood_pressure_trend) compatibleData.blood_pressure_trend = [];
      if (!compatibleData.heart_rate_trend) compatibleData.heart_rate_trend = [];
      
      setStatistics(compatibleData);
    } catch (error: any) {
      console.error('获取健康统计数据失败', error);
      const errorMsg = error.response?.data?.detail || error.message || '获取统计数据失败，请重试';
      setError(errorMsg);
      message.error(`获取统计数据失败: ${errorMsg}`);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载和日期范围变化时获取数据
  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);
  
  // 处理日期范围变化
  const handleDateRangeChange = (dates: [dayjs.Dayjs, dayjs.Dayjs]) => {
    if (dates && dates.length === 2) {
      console.log('日期范围变更:', dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
      setDateRange(dates);
    }
  };
  
  // 图表配置和数据
  const chartData = prepareChartData();
  
  return (
    <Card 
      title="健康数据统计与趋势" 
      variant="borderless"
      extra={
        <RangePicker 
          value={dateRange} 
          onChange={handleDateRangeChange as any}
          allowClear={false}
        />
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" tip="加载统计数据中..." />
        </div>
      ) : error ? (
        <Alert message="数据加载错误" description={error} type="error" showIcon />
      ) : !statistics || chartData.length === 0 ? (
        <Empty description="该时间段内暂无健康数据记录" />
      ) : (
        <>
          {/* 统计卡片 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic 
                  title="平均体重" 
                  value={statistics.weight_avg || 0} 
                  precision={1}
                  suffix="kg" 
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic 
                  title="平均收缩压" 
                  value={statistics.systolic_pressure_avg || 0} 
                  precision={0}
                  suffix="mmHg" 
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic 
                  title="平均舒张压" 
                  value={statistics.diastolic_pressure_avg || 0} 
                  precision={0}
                  suffix="mmHg" 
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic 
                  title="平均心率" 
                  value={statistics.heart_rate_avg || 0} 
                  precision={0}
                  suffix="次/分钟" 
                />
              </Card>
            </Col>
          </Row>
          
          {/* 趋势图表 */}
          <Tabs
            defaultActiveKey="weight"
            items={[
              {
                key: 'weight',
                label: '体重趋势',
                children: (
                  <div className="chart-container" style={{ width: '100%', height: 300 }}>
                    {chartData.some(item => item.weight !== undefined) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis 
                            domain={['dataMin - 1', 'dataMax + 1']} 
                            unit="kg"
                          />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="weight" 
                            name="体重" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="暂无体重趋势数据" />
                    )}
                  </div>
                )
              },
              {
                key: 'blood_pressure',
                label: '血压趋势',
                children: (
                  <div className="chart-container" style={{ width: '100%', height: 300 }}>
                    {chartData.some(item => item.systolic !== undefined || item.diastolic !== undefined) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis unit="mmHg" />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="systolic" 
                            name="收缩压" 
                            stroke="#ff7300" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="diastolic" 
                            name="舒张压" 
                            stroke="#387908" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="暂无血压趋势数据" />
                    )}
                  </div>
                )
              },
              {
                key: 'heart_rate',
                label: '心率趋势',
                children: (
                  <div className="chart-container" style={{ width: '100%', height: 300 }}>
                    {chartData.some(item => item.heart_rate !== undefined) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis 
                            domain={['dataMin - 5', 'dataMax + 5']} 
                            unit="次/分钟"
                          />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="heart_rate" 
                            name="心率" 
                            stroke="#ff0000" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="暂无心率趋势数据" />
                    )}
                  </div>
                )
              },
            ]}
          />
        </>
      )}
    </Card>
  );
};

export default HealthStatistics; 