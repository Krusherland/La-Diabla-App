import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

const AdminLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // For portfolio demo - allow access but show notice if not admin
  const isActualAdmin = isAuthenticated && user?.role === 'admin';

  const navLinkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-rye group ${
      location.pathname === path
        ? 'bg-diabla-black text-diabla-pepperYellow border border-diabla-emberRed'
        : 'text-diabla-smokeGray hover:bg-diabla-black hover:text-diabla-pepperYellow'
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
            <span className="font-metal text-sm uppercase tracking-wider">
              Modo Demo - Panel de Administración (Portfolio)
            </span>
          </div>
        </div>
      )}
      
      {/* Top bar */}
      <div className="diabla-card border-b border-diabla-darkGray">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Hamburger button - mobile only */}
          <button
            className="lg:hidden p-2 rounded-lg text-diabla-hotRed hover:bg-diabla-black border border-diabla-darkGray"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🔥</span>
            <span className="font-metal text-lg md:text-2xl text-fire-glow uppercase tracking-wider group-hover:text-diabla-flameOrange transition-colors">
              <span className="hidden sm:inline">La Diabla </span>Admin
            </span>
          </Link>

          <div className="flex items-center gap-2 ml-auto">
            {isAuthenticated && user ? (
              <>
                <span className="hidden md:block text-sm text-diabla-smokeGray font-rye">
                  <span className="text-diabla-pepperYellow font-metal">{user.name}</span>
                </span>
                <button onClick={logout} className="diabla-button-outline text-sm px-3 py-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="diabla-button text-sm px-3 py-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>

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
            className={`fixed lg:static top-0 left-0 h-full lg:h-fit z-50 lg:z-auto w-64 diabla-card p-4 lg:sticky lg:top-6 transition-transform duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            {/* Close button - mobile only */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <span className="font-metal text-diabla-hotRed uppercase tracking-wider">Menú</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-diabla-smokeGray hover:text-diabla-fireRed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-2">
              {/* Panel de Control Section */}
              <div className="mb-4">
                <h3 className="text-xs font-metal uppercase tracking-wider text-diabla-smokeGray mb-2 px-3">
                  Panel de Control
                </h3>
                <Link
                  to="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass('/admin')}
                >
                  <svg className="w-5 h-5 group-hover:text-diabla-flameOrange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
              </div>

              {/* Gestión Section */}
              <div className="mb-4">
                <h3 className="text-xs font-metal uppercase tracking-wider text-diabla-smokeGray mb-2 px-3">
                  Gestión
                </h3>
                <Link
                  to="/admin/products"
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass('/admin/products')}
                >
                  <svg className="w-5 h-5 group-hover:text-diabla-flameOrange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Productos
                </Link>
                <Link
                  to="/admin/orders"
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass('/admin/orders')}
                >
                  <svg className="w-5 h-5 group-hover:text-diabla-flameOrange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Pedidos
                </Link>
              </div>

              {/* Sistema Section */}
              <div>
                <h3 className="text-xs font-metal uppercase tracking-wider text-diabla-smokeGray mb-2 px-3">
                  Sistema
                </h3>
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-diabla-smokeGray hover:bg-diabla-black hover:text-diabla-pepperYellow transition-all font-rye group"
                >
                  <svg className="w-5 h-5 group-hover:text-diabla-flameOrange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
