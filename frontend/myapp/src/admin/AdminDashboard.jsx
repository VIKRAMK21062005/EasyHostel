import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import AdminDashboardView from './AdminDashboardView';
import AdminProductsView from './AdminProductView';
import AdminOrdersView from './AdminOrdersView';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onCartClick={() => {}}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeView={activeView}
          setActiveView={setActiveView}
          userRole="Admin"
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {activeView === 'dashboard' && <AdminDashboardView />}
          {activeView === 'products' && <AdminProductsView />}
          {activeView === 'orders' && <AdminOrdersView />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
