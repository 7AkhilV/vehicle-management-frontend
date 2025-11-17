import { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { errorHandler } from '../../utils/errorHandler';
import Layout from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Input from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    vin: '',
    status: 'available'
  });
  const { toasts, showToast, removeToast } = useToast();

  const sidebarLinks = [
    { label: 'User Management', path: '/admin/users' },
    { label: 'Vehicle Management', path: '/admin/vehicles' },
    { label: 'Vehicle Assignment', path: '/admin/assignments' },
  ];

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleService.getAllVehicles();
      // Handle nested response structure: response.data.data.vehicles or response.data.data
      const vehiclesData = response.data?.data?.vehicles || response.data?.vehicles || response.data?.data || response.data || [];
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (vehicle = null) => {
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        vin: vehicle.vin,
        status: vehicle.status
      });
    } else {
      setSelectedVehicle(null);
      setFormData({ make: '', model: '', year: '', licensePlate: '', vin: '', status: 'available' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedVehicle) {
        await vehicleService.updateVehicle(selectedVehicle._id, formData);
        showToast('Vehicle updated successfully', 'success');
      } else {
        await vehicleService.createVehicle(formData);
        showToast('Vehicle created successfully', 'success');
      }
      fetchVehicles();
      handleCloseModal();
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await vehicleService.deleteVehicle(selectedVehicle._id);
      showToast('Vehicle deleted successfully', 'success');
      fetchVehicles();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (vehicle) => {
    setLoading(true);
    try {
      const response = await vehicleService.getVehicleById(vehicle._id);
      const details = response.data?.data || response.data;
      setVehicleDetails(details);
      setIsDetailsModalOpen(true);
    } catch (error) {
      errorHandler.handleApiError(error, showToast);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Make', accessor: 'make' },
    { header: 'Model', accessor: 'model' },
    { header: 'Year', accessor: 'year' },
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
  ];

  const actions = (row) => (
    <>
      <Button variant="secondary" onClick={() => handleViewDetails(row)}>
        View Details
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
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
        <Button onClick={() => handleOpenModal()}>Create Vehicle</Button>
      </div>

      <div className="card">
        {loading && vehicles.length === 0 ? (
          <p className="text-center py-4">Loading...</p>
        ) : (
          <Table columns={columns} data={vehicles} actions={actions} />
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedVehicle ? 'Edit Vehicle' : 'Create Vehicle'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            required
          />
          <Input
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
          <Input
            label="Year"
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
          <Input
            label="License Plate"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            required
          />
          <Input
            label="VIN"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" type="button" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : selectedVehicle ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle"
        message={`Are you sure you want to delete ${selectedVehicle?.make} ${selectedVehicle?.model}?`}
      />

      {/* Vehicle Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Vehicle Details"
      >
        {vehicleDetails ? (
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                {vehicleDetails.make} {vehicleDetails.model}
              </h4>
            </div>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgb(229, 231, 235)' }}>
                <span style={{ fontWeight: '500', color: 'rgb(107, 114, 128)' }}>Year:</span>
                <span>{vehicleDetails.year}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgb(229, 231, 235)' }}>
                <span style={{ fontWeight: '500', color: 'rgb(107, 114, 128)' }}>License Plate:</span>
                <span>{vehicleDetails.licensePlate}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgb(229, 231, 235)' }}>
                <span style={{ fontWeight: '500', color: 'rgb(107, 114, 128)' }}>VIN:</span>
                <span>{vehicleDetails.vin}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgb(229, 231, 235)' }}>
                <span style={{ fontWeight: '500', color: 'rgb(107, 114, 128)' }}>Status:</span>
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '0.25rem', 
                  fontSize: '0.875rem',
                  backgroundColor: vehicleDetails.status === 'available' ? 'rgb(220, 252, 231)' : 
                                 vehicleDetails.status === 'assigned' ? 'rgb(219, 234, 254)' : 
                                 'rgb(254, 249, 195)',
                  color: vehicleDetails.status === 'available' ? 'rgb(22, 101, 52)' : 
                         vehicleDetails.status === 'assigned' ? 'rgb(30, 64, 175)' : 
                         'rgb(133, 77, 14)'
                }}>
                  {vehicleDetails.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgb(229, 231, 235)' }}>
                <span style={{ fontWeight: '500', color: 'rgb(107, 114, 128)' }}>Currently Assigned To:</span>
                <span>{vehicleDetails.assignedTo ? 
                  (typeof vehicleDetails.assignedTo === 'object' ? vehicleDetails.assignedTo.name : vehicleDetails.assignedTo) : 
                  'Not Assigned'
                }</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgb(229, 231, 235)' }}>
                <span style={{ fontWeight: '500', color: 'rgb(107, 114, 128)' }}>Created At:</span>
                <span>{new Date(vehicleDetails.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgb(229, 231, 235)' }}>
                <span style={{ fontWeight: '500', color: 'rgb(107, 114, 128)' }}>Last Updated:</span>
                <span>{new Date(vehicleDetails.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Assignment History */}
            {vehicleDetails.assignmentHistory && vehicleDetails.assignmentHistory.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h5 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                  Assignment History
                </h5>
                <div style={{ backgroundColor: 'rgb(249, 250, 251)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  {vehicleDetails.assignmentHistory.map((assignment, index) => (
                    <div key={index} style={{ 
                      padding: '0.5rem', 
                      backgroundColor: 'white', 
                      borderRadius: '0.25rem', 
                      marginBottom: index < vehicleDetails.assignmentHistory.length - 1 ? '0.5rem' : '0',
                      fontSize: '0.875rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: '500' }}>User ID:</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{assignment.userId}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: '500' }}>Assigned:</span>
                        <span>{new Date(assignment.assignedAt).toLocaleString()}</span>
                      </div>
                      {assignment.unassignedAt && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: '500' }}>Unassigned:</span>
                          <span>{new Date(assignment.unassignedAt).toLocaleString()}</span>
                        </div>
                      )}
                      {!assignment.unassignedAt && (
                        <div style={{ color: 'rgb(22, 163, 74)', fontWeight: '500', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                          Currently Active
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '1rem' }}>Loading...</p>
        )}
      </Modal>
    </Layout>
  );
};

export default VehicleManagement;

