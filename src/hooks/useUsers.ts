import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setUsers, setLoading, setPagination } from '../store/slices/usersSlice';
import { userAPI } from '../services/api';

export const useUsers = () => {
  const dispatch = useDispatch();
  const { list, filters, pagination } = useSelector((state: RootState) => state.users);

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

  return {
    users: paginatedUsers,
    totalUsers: filteredUsers.length,
    loading: useSelector((state: RootState) => state.users.loading),
  };
};