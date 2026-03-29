import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StudentProductsView from './StudentProductView';
import StudentOrdersView from './StudentOrderView';
import StudentCartView from './StudentCardview';
import CustomOrderView from './CustomOrderView';
import ParcelPickupView from './ParcelPickipView';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('shop');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onCartClick={() => setActiveView('cart')}
      />
      
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeView={activeView}
          setActiveView={setActiveView}
          userRole="Student"
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {activeView === 'shop' && <StudentProductsView />}
          {activeView === 'orders' && <StudentOrdersView />}
          {activeView === 'cart' && <StudentCartView />}
          {activeView === 'custom-order' && <CustomOrderView />}
          {activeView === 'parcel-pickup' && <ParcelPickupView />}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;