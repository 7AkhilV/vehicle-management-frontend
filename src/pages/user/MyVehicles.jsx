import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { errorHandler } from '../../utils/errorHandler';
import Layout from '../../components/layout/Layout';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const sidebarLinks = [
    { label: 'My Profile', path: '/user/profile' },
    { label: 'My Vehicles', path: '/user/vehicles' },
  ];

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await userService.getMyVehicles();
      // Handle nested response structure
      const vehiclesData = response.data?.data?.vehicles || response.data?.vehicles || response.data?.data || response.data || [];
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
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
        <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
      </div>

      {loading ? (
        <p className="text-center py-8">Loading...</p>
      ) : vehicles.length === 0 ? (
        <div className="card text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Vehicles Assigned</h3>
          <p className="mt-1 text-gray-500">You don&apos;t have any vehicles assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(vehicles) && vehicles.map((vehicle) => (
            <div key={vehicle._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {vehicle.make} {vehicle.model}
                </h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  vehicle.status === 'available' ? 'bg-green-100 text-green-800' : 
                  vehicle.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {vehicle.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Year:</strong> {vehicle.year}</p>
                <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
                <p><strong>VIN:</strong> {vehicle.vin}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyVehicles;

