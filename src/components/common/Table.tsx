import React from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onSort?: (key: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  emptyMessage?: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  onSort,
  sortBy,
  sortOrder,
  emptyMessage = 'No data found'
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-200 transition-colors' : ''
                }`}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center space-x-2">
                  <span>{column.label}</span>
                  {sortBy === column.key && (
                    <span className="text-gray-600 text-sm font-normal">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-6 py-16 text-center"
              >
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <div className="text-5xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
                  <p className="text-gray-400 max-w-md">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr 
                key={index} 
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 group-hover:text-gray-700"
                  >
                    <div className="flex items-center">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;