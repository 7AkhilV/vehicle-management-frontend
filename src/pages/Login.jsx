import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { errorHandler } from '../utils/errorHandler';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'admin' ? '/admin/users' : '/user/profile';
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      const { token, user: userData } = response.data;

      login(token, userData);
      showToast('Login successful!', 'success');

      // Redirect based on role
      setTimeout(() => {
        const redirectPath = userData.role === 'admin' ? '/admin/users' : '/user/profile';
        navigate(redirectPath);
      }, 500);
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toast toasts={toasts} onRemove={removeToast} />
      
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-primary-600 mb-6">
          Vehicle Management
        </h2>
        <h3 className="text-xl font-semibold text-center text-gray-700 mb-8">
          Login
        </h3>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo Credentials:</p>
          <p className="mt-2">Admin: admin@example.com / admin123</p>
          <p>User: john@example.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

