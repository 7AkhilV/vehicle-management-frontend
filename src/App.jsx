import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Admin Pages
import UserManagement from './pages/admin/UserManagement';
import VehicleManagement from './pages/admin/VehicleManagement';
import VehicleAssignment from './pages/admin/VehicleAssignment';

// User Pages
import Profile from './pages/user/Profile';
import MyVehicles from './pages/user/MyVehicles';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Root redirect component
const RootRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  const redirectPath = user.role === 'admin' ? '/admin/users' : '/user/profile';
  return <Navigate to={redirectPath} replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Admin Routes */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vehicles"
            element={
              <ProtectedRoute requiredRole="admin">
                <VehicleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assignments"
            element={
              <ProtectedRoute requiredRole="admin">
                <VehicleAssignment />
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute requiredRole="user">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/vehicles"
            element={
              <ProtectedRoute requiredRole="user">
                <MyVehicles />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
