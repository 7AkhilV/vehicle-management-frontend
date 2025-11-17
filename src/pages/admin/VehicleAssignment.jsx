import { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { userService } from '../../services/userService';
import { errorHandler } from '../../utils/errorHandler';
import Layout from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';

const VehicleAssignment = () => {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const { toasts, showToast, removeToast } = useToast();

  const sidebarLinks = [
    { label: 'User Management', path: '/admin/users' },
    { label: 'Vehicle Management', path: '/admin/vehicles' },
    { label: 'Vehicle Assignment', path: '/admin/assignments' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vehiclesResponse, usersResponse] = await Promise.all([
        vehicleService.getAllVehicles(),
        userService.getAllUsers()
      ]);
      // Handle nested response structure
      const vehiclesData = vehiclesResponse.data?.data?.vehicles || vehiclesResponse.data?.vehicles || vehiclesResponse.data?.data || vehiclesResponse.data || [];
      const usersData = usersResponse.data?.data?.users || usersResponse.data?.users || usersResponse.data || [];
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedUserId('');
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await vehicleService.assignVehicle(selectedVehicle._id, selectedUserId);
      showToast('Vehicle assigned successfully', 'success');
      fetchData();
      setIsAssignModalOpen(false);
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async (vehicle) => {
    setLoading(true);
    try {
      await vehicleService.unassignVehicle(vehicle._id);
      showToast('Vehicle unassigned successfully', 'success');
      fetchData();
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Vehicle', render: (row) => `${row.make} ${row.model}` },
    { header: 'License Plate', accessor: 'licensePlate' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`px-2 py-1 rounded text-sm ${
        row.status === 'available' ? 'bg-green-100 text-green-800' : 
        row.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 
        'bg-yellow-100 text-yellow-800'
      }`}>
        {row.status}
      </span>
    )},
    { 
      header: 'Assigned To', 
      render: (row) => {
        if (row.assignedTo) {
          // assignedTo can be either an object with user details or just an ID
          if (typeof row.assignedTo === 'object' && row.assignedTo.name) {
            return row.assignedTo.name;
          } else if (Array.isArray(users)) {
            const userId = typeof row.assignedTo === 'object' ? row.assignedTo._id : row.assignedTo;
            const user = users.find(u => u._id === userId || u.id === userId);
            return user ? user.name : 'Unknown User';
          }
        }
        return 'Not Assigned';
      }
    },
  ];

  const actions = (row) => (
    <>
      {row.status === 'assigned' ? (
        <Button variant="secondary" onClick={() => handleUnassign(row)}>
          Unassign
        </Button>
      ) : (
        <Button onClick={() => handleAssignClick(row)}>
          Assign
        </Button>
      )}
    </>
  );

  return (
    <Layout sidebarLinks={sidebarLinks}>
      <Toast toasts={toasts} onRemove={removeToast} />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Assignment</h1>
      </div>

      <div className="card">
        {loading && vehicles.length === 0 ? (
          <p className="text-center py-4">Loading...</p>
        ) : (
          <Table columns={columns} data={vehicles} actions={actions} />
        )}
      </div>

      {/* Assign Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Vehicle"
      >
        <form onSubmit={handleAssignSubmit}>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Assigning: <strong>{selectedVehicle?.make} {selectedVehicle?.model}</strong>
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select User <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="input-field"
              required
            >
              <option value="">-- Select User --</option>
              {Array.isArray(users) && users.filter(u => u.role === 'user').map((user) => (
                <option key={user._id || user.id} value={user._id || user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default VehicleAssignment;

