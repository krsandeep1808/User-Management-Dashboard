import React from 'react';
import { User } from '../../types';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {user.status}
            </span>
            <span className="text-sm text-gray-500">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <button
          onClick={() => onEdit(user)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default UserCard;