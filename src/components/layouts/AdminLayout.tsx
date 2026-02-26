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
    `flex items-center gap-3 px-3 py-2 rounded-lg font-rye ${
      location.pathname === path
        ? 'bg-diabla-black text-diabla-pepperYellow border border-diabla-emberRed'
        : 'text-diabla-smokeGray'
    }`;

  return (
    <div className="min-h-screen bg-diabla-black">
      {/* Demo Notice Banner - only shown when not logged in as admin */}
      {!isActualAdmin && (
        <div className="bg-gradient-to-r from-diabla-flameOrange to-diabla-fireRed text-white py-3 px-4">
          <div className="container mx-auto flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-burned text-sm uppercase tracking-wider">
              Modo Demo - Panel de Administración (Portfolio)
            </span>
          </div>
        </div>
      )}
      
      {/* Admin Navbar - matching main site style */}
      <header className="sticky top-0 z-50 navbar-diabla">
        <div className="navbar container mx-auto px-4">
          <div className="navbar-start">
            {/* Hamburger button for sidebar - mobile only */}
            <button
              className="btn btn-ghost lg:hidden text-diabla-hotRed"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link to="/" className="btn btn-ghost normal-case text-xl font-burned text-diabla-fireRed hover:text-diabla-pepperYellow uppercase tracking-wider">
              <img src={logo} alt="La Diabla" className="h-8 w-auto" />
              <span className="hidden sm:inline text-fire-glow">LA DIABLA</span>
              <span className="text-diabla-flameOrange ml-1">ADMIN</span>
            </Link>
          </div>

          {/* Desktop quick links */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li><Link to="/admin" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye uppercase">Dashboard</Link></li>
              <li><Link to="/admin/products" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye uppercase">Productos</Link></li>
              <li><Link to="/admin/orders" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye uppercase">Pedidos</Link></li>
            </ul>
          </div>

          {/* Right side - Return to site & User */}
          <div className="navbar-end gap-2">
            {/* Return to main site */}
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-diabla-flameOrange to-diabla-fireRed text-white rounded-lg hover:scale-105 transition-transform font-burned uppercase text-xs sm:text-sm tracking-wider shadow-ember"
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
                  <div className="bg-gradient-to-br from-diabla-emberRed to-diabla-fireRed text-white rounded-full w-10 shadow-ember">
                    <span className="text-xl font-burned">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-fire bg-diabla-charcoal rounded-box w-52 border border-diabla-emberRed"
                >
                  <li className="menu-title">
                    <span className="text-diabla-pepperYellow font-burned">{user.name}</span>
                  </li>
                  <li><Link to="/profile" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Mi Perfil</Link></li>
                  <li><button onClick={logout} className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Cerrar Sesion</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-gradient-to-r from-diabla-emberRed to-diabla-hotRed text-white rounded-lg hover:scale-105 transition-transform font-burned uppercase text-sm tracking-wider shadow-ember">
                Iniciar Sesion
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
            className={`fixed lg:static top-0 left-0 h-full lg:h-fit z-50 lg:z-auto w-64 admin-card p-4 lg:sticky lg:top-6 transition-transform duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            {/* Close button - mobile only */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <span className="font-burned text-diabla-hotRed uppercase tracking-wider">Menú</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-diabla-smokeGray"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-2">
              {/* Panel de Control Section */}
              <div className="mb-4">
                <h3 className="text-xs font-burned uppercase tracking-wider text-diabla-smokeGray mb-2 px-3">
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
                <h3 className="text-xs font-burned uppercase tracking-wider text-diabla-smokeGray mb-2 px-3">
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
                <h3 className="text-xs font-burned uppercase tracking-wider text-diabla-smokeGray mb-2 px-3">
                  Sistema
                </h3>
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-diabla-smokeGray font-rye"
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
