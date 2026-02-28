import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import logo from '../../assets/logo.png';

const AdminLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // For portfolio demo - allow access but show notice if not admin
  const isActualAdmin = isAuthenticated && user?.role === 'admin';

  const navLinkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-rye text-sm transition-all ${
      location.pathname === path
        ? 'bg-diabla-emberRed/20 text-diabla-emberRed border border-diabla-emberRed/30'
        : 'text-gray-400 hover:text-gray-200 hover:bg-diabla-black/50'
    }`;

  return (
    <div className="min-h-screen bg-diabla-black">
      {/* Demo Notice Banner - only shown when not logged in as admin */}
      {!isActualAdmin && (
        <div className="bg-gradient-to-r from-orange-600/90 to-red-600/90 text-white py-2 px-4 text-center">
          <div className="container mx-auto flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-rye text-xs uppercase tracking-wider">
              Modo Demo - Panel de Administración
            </span>
          </div>
        </div>
      )}
      
      {/* Admin Navbar - matching professional style */}
      <header className="sticky top-0 z-50 bg-diabla-charcoal border-b border-diabla-darkGray shadow-lg">
        <div className="navbar container mx-auto px-4">
          <div className="navbar-start">
            {/* Hamburger button for sidebar - mobile only */}
            <button
              className="btn btn-ghost lg:hidden text-gray-400 hover:text-gray-200"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link to="/" className="btn btn-ghost normal-case text-xl font-rye text-gray-100 hover:text-diabla-emberRed uppercase tracking-wider">
              <img src={logo} alt="La Diabla" className="h-8 w-auto" />
              <span className="hidden sm:inline">LA DIABLA</span>
              <span className="text-diabla-emberRed ml-1 text-sm">ADMIN</span>
            </Link>
          </div>

          {/* Desktop quick links */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-1">
              <li><Link to="/admin" className="text-gray-400 hover:text-gray-100 hover:bg-diabla-black/50 font-rye text-sm">Dashboard</Link></li>
              <li><Link to="/admin/products" className="text-gray-400 hover:text-gray-100 hover:bg-diabla-black/50 font-rye text-sm">Productos</Link></li>
              <li><Link to="/admin/orders" className="text-gray-400 hover:text-gray-100 hover:bg-diabla-black/50 font-rye text-sm">Pedidos</Link></li>
            </ul>
          </div>

          {/* Right side - Return to site & User */}
          <div className="navbar-end gap-2">
            {/* Return to main site */}
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-diabla-emberRed/20 hover:bg-diabla-emberRed text-diabla-emberRed hover:text-white border border-diabla-emberRed/30 hover:border-diabla-emberRed rounded-lg font-rye uppercase text-xs sm:text-sm tracking-wider transition-all"
              title="Ir al Sitio Web"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:inline">Sitio Web</span>
            </Link>

            {/* User menu */}
            {isAuthenticated && user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
                  <div className="bg-diabla-emberRed/20 border-2 border-diabla-emberRed/50 text-diabla-emberRed rounded-full w-10">
                    <span className="text-lg font-rye">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-diabla-charcoal rounded-lg w-52 border border-diabla-darkGray"
                >
                  <li className="menu-title">
                    <span className="text-gray-300 font-rye">{user.name}</span>
                  </li>
                  <li><Link to="/profile" className="text-gray-400 hover:text-gray-200 font-rye">Mi Perfil</Link></li>
                  <li><button onClick={logout} className="text-gray-400 hover:text-gray-200 font-rye">Cerrar Sesión</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-diabla-emberRed hover:bg-diabla-fireRed text-white rounded-lg transition-colors font-rye uppercase text-sm tracking-wider">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            className={`fixed lg:static top-0 left-0 h-full lg:h-fit z-50 lg:z-auto w-64 bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray rounded-none lg:rounded-lg border-r lg:border border-diabla-darkGray p-4 lg:sticky lg:top-6 transition-transform duration-300 shadow-2xl lg:shadow-none ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            {/* Close button - mobile only */}
            <div className="flex items-center justify-between mb-4 lg:hidden pb-4 border-b border-diabla-darkGray">
              <span className="font-rye text-gray-100 uppercase tracking-wider">Menú</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-2">
              {/* Panel de Control Section */}
              <div className="mb-4">
                <h3 className="text-xs font-rye uppercase tracking-wider text-gray-500 mb-2 px-3">
                  Panel de Control
                </h3>
                <Link
                  to="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass('/admin')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
              </div>

              {/* Gestión Section */}
              <div className="mb-4">
                <h3 className="text-xs font-rye uppercase tracking-wider text-gray-500 mb-2 px-3">
                  Gestión
                </h3>
                <Link
                  to="/admin/products"
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass('/admin/products')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Productos
                </Link>
                <Link
                  to="/admin/orders"
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass('/admin/orders')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Pedidos
                </Link>
              </div>

              {/* Sistema Section */}
              <div>
                <h3 className="text-xs font-rye uppercase tracking-wider text-gray-500 mb-2 px-3">
                  Sistema
                </h3>
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-diabla-black/50 font-rye text-sm transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ir al Sitio Web
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
