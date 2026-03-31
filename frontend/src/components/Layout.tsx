import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-black text-indigo-600 tracking-tighter">Booking<span className="text-gray-900">App</span></span>
              </Link>
              
              {isAuthenticated && (
                <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                  <Link to="/" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${location.pathname === '/' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900'}`}>
                    <HomeIcon className="w-4 h-4 mr-2"/> Directory
                  </Link>
                  <Link to="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900'}`}>
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </Link>
                </div>
              )}
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="text-sm text-gray-500 hover:text-indigo-600 font-medium">Business Login</Link>
                  <Link to="/register" className="bg-white border border-indigo-200 text-indigo-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-50 transition shadow-sm hover:shadow-md">
                    Register Business
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SaaS Starter. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
