import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode, sidebarOpen } = useSelector((state: RootState) => state.ui);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      <div className="flex">
        <Sidebar />
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
          }`}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;