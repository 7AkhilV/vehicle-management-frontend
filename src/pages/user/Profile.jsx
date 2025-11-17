import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { errorHandler } from '../../utils/errorHandler';
import Layout from '../../components/layout/Layout';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const sidebarLinks = [
    { label: 'My Profile', path: '/user/profile' },
    { label: 'My Vehicles', path: '/user/vehicles' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userService.getMyProfile();
      // Handle nested response structure
      const profileData = response.data?.data?.user || response.data?.user || response.data?.data || response.data;
      setProfile(profileData);
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout sidebarLinks={sidebarLinks}>
      <Toast toasts={toasts} onRemove={removeToast} />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      </div>

      <div className="card max-w-2xl">
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : profile ? (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg text-gray-900">{profile.name}</p>
            </div>
            <div className="border-b pb-4">
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg text-gray-900">{profile.email}</p>
            </div>
            <div className="border-b pb-4">
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="text-lg">
                <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                  {profile.role}
                </span>
              </p>
            </div>
            {profile.phone && (
              <div className="border-b pb-4">
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-lg text-gray-900">{profile.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Member Since</label>
              <p className="text-lg text-gray-900">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No profile data available</p>
        )}
      </div>
    </Layout>
  );
};

export default Profile;

