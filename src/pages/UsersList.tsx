import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { setFilters, setPagination } from '../store/slices/usersSlice';
import { useUsers } from '../hooks/useUsers';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Filters from '../components/common/Filters';
import Modal from '../components/common/Modal';
import UserForm from '../components/users/UserForm';
import { updateUser } from '../store/slices/usersSlice';
import { userAPI } from '../services/api';

const UsersList: React.FC = () => {
  const dispatch = useDispatch();
  const { filters, pagination } = useSelector((state: RootState) => state.users);
  const { users, totalUsers, loading } = useUsers();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleSort = (key: string) => {
    const newSortOrder = filters.sortBy === key && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setFilters({ sortBy: key, sortOrder: newSortOrder }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPagination({ page }));
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  const handleUpdateUser = async (formData: any) => {
    if (!editingUser) return;

    setFormLoading(true);
    try {
      // Update via API
      await userAPI.updateUser(editingUser.id, formData);
      
      // Update local state
      dispatch(updateUser({ id: editingUser.id, ...formData }));
      setEditModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    {
      key: 'avatar',
      label: 'Avatar',
      render: (value: string, row: any) => (
        <img src={value} alt={row.name} className="w-8 h-8 rounded-full" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string, row: any) => (
        <Link
          to={`/users/${row.id}`}
          className="text-blue-600 hover:text-blue-900 font-medium"
        >
          {value}
        </Link>
      ),
    },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <Link
            to={`/users/${row.id}`}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            View
          </Link>
          <button
            onClick={() => handleEditUser(row)}
            className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(totalUsers / pagination.limit);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your users and their permissions</p>
      </div>

      <Filters />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Table
          columns={columns}
          data={users}
          onSort={handleSort}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          emptyMessage="No users found matching your criteria"
        />
        
        {totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingUser(null);
        }}
        title="Edit User"
        size="md"
      >
        <UserForm
          user={editingUser}
          onSubmit={handleUpdateUser}
          onCancel={() => {
            setEditModalOpen(false);
            setEditingUser(null);
          }}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default UsersList;