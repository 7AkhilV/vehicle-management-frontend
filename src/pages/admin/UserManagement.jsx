import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { errorHandler } from '../../utils/errorHandler';
import Layout from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Input from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isVehiclesModalOpen, setIsVehiclesModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userVehicles, setUserVehicles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: ''
  });
  const { toasts, showToast, removeToast } = useToast();

  const sidebarLinks = [
    { label: 'User Management', path: '/admin/users' },
    { label: 'Vehicle Management', path: '/admin/vehicles' },
    { label: 'Vehicle Assignment', path: '/admin/assignments' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers();
      // Handle nested response structure: response.data.data.users
      const usersData = response.data?.data?.users || response.data?.users || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        phone: user.phone || ''
      });
    } else {
      setSelectedUser(null);
      setFormData({ name: '', email: '', password: '', role: 'user', phone: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedUser) {
        // Update user
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await userService.updateUser(selectedUser.id || selectedUser._id, updateData);
        showToast('User updated successfully', 'success');
      } else {
        // Create user
        await userService.createUser(formData);
        showToast('User created successfully', 'success');
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await userService.deleteUser(selectedUser.id || selectedUser._id);
      showToast('User deleted successfully', 'success');
      fetchUsers();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVehicles = async (user) => {
    setSelectedUser(user);
    setLoading(true);
    try {
      const response = await userService.getUserVehicles(user.id || user._id);
      const vehiclesData = response.data?.data?.vehicles || response.data?.vehicles || response.data?.data || response.data || [];
      setUserVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      setIsVehiclesModalOpen(true);
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role', render: (row) => (
      <span className={`px-2 py-1 rounded text-sm ${
        row.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {row.role}
      </span>
    )},
    { header: 'Phone', accessor: 'phone' },
  ];

  const actions = (row) => (
    <>
      <Button variant="secondary" onClick={() => handleViewVehicles(row)}>
        View Vehicles
      </Button>
      <Button variant="secondary" onClick={() => handleOpenModal(row)}>
        Edit
      </Button>
      <Button variant="danger" onClick={() => handleDeleteClick(row)}>
        Delete
      </Button>
    </>
  );

  return (
    <Layout sidebarLinks={sidebarLinks}>
      <Toast toasts={toasts} onRemove={removeToast} />
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <Button onClick={() => handleOpenModal()}>Create User</Button>
      </div>

      <div className="card">
        {loading && users.length === 0 ? (
          <p className="text-center py-4">Loading...</p>
        ) : (
          <Table columns={columns} data={users} actions={actions} />
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedUser ? 'Edit User' : 'Create User'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={!!selectedUser}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!selectedUser}
            placeholder={selectedUser ? 'Leave blank to keep current' : ''}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Input
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" type="button" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : selectedUser ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}?`}
      />

      {/* User Vehicles Modal */}
      <Modal
        isOpen={isVehiclesModalOpen}
        onClose={() => setIsVehiclesModalOpen(false)}
        title={`Vehicles Assigned to ${selectedUser?.name}`}
      >
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {userVehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'rgb(107, 114, 128)' }}>
              <svg
                style={{ margin: '0 auto', height: '3rem', width: '3rem', color: 'rgb(156, 163, 175)' }}
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
              <h3 style={{ marginTop: '0.5rem', fontSize: '1rem', fontWeight: '500' }}>
                No Vehicles Assigned
              </h3>
              <p style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
                This user doesn&apos;t have any vehicles assigned yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {userVehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  style={{
                    backgroundColor: 'rgb(249, 250, 251)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgb(229, 231, 235)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>
                      {vehicle.make} {vehicle.model}
                    </h4>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      backgroundColor: vehicle.status === 'available' ? 'rgb(220, 252, 231)' :
                                     vehicle.status === 'assigned' ? 'rgb(219, 234, 254)' :
                                     'rgb(254, 249, 195)',
                      color: vehicle.status === 'available' ? 'rgb(22, 101, 52)' :
                             vehicle.status === 'assigned' ? 'rgb(30, 64, 175)' :
                             'rgb(133, 77, 14)'
                    }}>
                      {vehicle.status}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.875rem', color: 'rgb(75, 85, 99)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '500' }}>Year:</span>
                      <span>{vehicle.year}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '500' }}>License Plate:</span>
                      <span>{vehicle.licensePlate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '500' }}>VIN:</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{vehicle.vin}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsVehiclesModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default UserManagement;

