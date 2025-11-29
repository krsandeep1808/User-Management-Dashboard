import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { setUsers, setFilters, setPagination, setLoading, updateUser } from '../store/slices/usersSlice';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Filters from '../components/common/Filters';
import Modal from '../components/common/Modal';
import UserForm from '../components/users/UserForm';
import { userAPI } from '../services/api';
import { User } from '../types';

const UsersList: React.FC = () => {
  const dispatch = useDispatch();
  const { list, filters, pagination, loading } = useSelector((state: RootState) => state.users);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setLoading(true));
      try {
        const response = await userAPI.getUsers();
        dispatch(setUsers(response.data));
        dispatch(setPagination({ total: response.data.length }));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleSort = (key: string) => {
    const newSortOrder = filters.sortBy === key && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setFilters({ sortBy: key, sortOrder: newSortOrder }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPagination({ page }));
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  const handleUpdateUser = async (formData: Partial<User>) => {
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

  // Filter and sort users
  const filteredUsers = list
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           user.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = !filters.status || user.status === filters.status;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'name') {
        return filters.sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (filters.sortBy === 'createdAt') {
        return filters.sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  // Paginate results
  const startIndex = (pagination.page - 1) * pagination.limit;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pagination.limit);
  const totalPages = Math.ceil(filteredUsers.length / pagination.limit);

  const columns = [
    {
      key: 'avatar',
      label: 'Avatar',
      render: (value: string, row: User) => (
        <img src={value} alt={row.name} className="w-8 h-8 rounded-full" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string, row: User) => (
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
      render: (value: any, row: User) => (
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
          data={paginatedUsers}
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