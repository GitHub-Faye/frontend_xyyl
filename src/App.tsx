import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { MainLayout } from './components/Layout/MainLayout';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Home } from './pages/Home';
import { ProfilePage } from './pages/Profile';
import HealthRecords from './pages/HealthRecords';
import HealthRecordDetail from './components/HealthRecordDetail';
import HealthRecordForm from './components/HealthRecordForm';
import HealthStatistics from './components/HealthStatistics';

// 导入其他页面组件...

export function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            {/* 公共路由 */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* 受保护的路由 */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            
            {/* 健康记录路由 - 原路径 */}
            <Route
              path="/health-records"
              element={
                <PrivateRoute>
                  <HealthRecords />
                </PrivateRoute>
              }
            />
            <Route
              path="/health-records/new"
              element={
                <PrivateRoute>
                  <HealthRecordForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/health-records/:id"
              element={
                <PrivateRoute>
                  <HealthRecordDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/health-records/edit/:id"
              element={
                <PrivateRoute>
                  <HealthRecordForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/health-statistics"
              element={
                <PrivateRoute>
                  <HealthStatistics />
                </PrivateRoute>
              }
            />
            
            {/* 新增路径 - 避免与Remix路由冲突 */}
            <Route
              path="/react-health-records"
              element={
                <PrivateRoute>
                  <HealthRecords />
                </PrivateRoute>
              }
            />
            <Route
              path="/react-health-records/new"
              element={
                <PrivateRoute>
                  <HealthRecordForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/react-health-statistics"
              element={
                <PrivateRoute>
                  <HealthStatistics />
                </PrivateRoute>
              }
            />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
} 