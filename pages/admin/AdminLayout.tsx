import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, Image, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-bold text-primary">Admin Panel</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${
                isActive ? 'bg-ceylon-100 text-ceylon-800' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/tours"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${
                isActive ? 'bg-ceylon-100 text-ceylon-800' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Map className="w-5 h-5 mr-3" />
            Tours
          </NavLink>
          <NavLink
            to="/admin/gallery"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${
                isActive ? 'bg-ceylon-100 text-ceylon-800' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Image className="w-5 h-5 mr-3" />
            Gallery
          </NavLink>
          <NavLink
            to="/admin/map"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${
                isActive ? 'bg-ceylon-100 text-ceylon-800' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Map className="w-5 h-5 mr-3" />
            Interactive Map
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${
                isActive ? 'bg-ceylon-100 text-ceylon-800' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </NavLink>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center p-3 text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors mb-2"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
           <button
            onClick={() => navigate('/')}
            className="flex items-center p-3 text-gray-500 hover:bg-gray-50 rounded-lg w-full transition-colors text-sm"
          >
            Back to Site
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 relative">
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.08]">
             <img src="/assets/logo.png" alt="Watermark" className="w-[600px] h-[600px] object-contain grayscale" />
        </div>
        <div className="relative z-10">
             <Outlet />
        </div>
      </div>
    </div>
  );
};
