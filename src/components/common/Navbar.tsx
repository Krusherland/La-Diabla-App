import { Link } from 'react-router-dom';
import { useAuth, useCart } from '../../hooks';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 navbar-diabla">
      <div className="navbar container mx-auto px-4">
        <div className="navbar-start">
          {/* Mobile menu */}
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden text-diabla-hotRed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-diabla-charcoal rounded-box w-52 border border-diabla-emberRed"
            >
              <li><Link to="/" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Home</Link></li>
              <li><Link to="/menu" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Menu</Link></li>
              <li><Link to="/about" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Nosotros</Link></li>
              <li><Link to="/locations" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Sucursales</Link></li>
              <li><Link to="/contact" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Contacto</Link></li>
              <li><Link to="/track" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Rastrear Pedido</Link></li>
            </ul>
          </div>

          {/* Logo */}
          <Link to="/" className="btn btn-ghost normal-case text-xl font-burned text-diabla-fireRed hover:text-diabla-pepperYellow uppercase tracking-wider">
            <img src={logo} alt="La Diabla" className="h-8 w-auto" />
            <span className="hidden sm:inline text-fire-glow">LA DIABLA</span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye uppercase">Home</Link></li>
            <li><Link to="/menu" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye uppercase">Menu</Link></li>
            <li><Link to="/about" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye uppercase">Nosotros</Link></li>
            <li><Link to="/locations" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye uppercase">Sucursales</Link></li>
            <li><Link to="/contact" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye uppercase">Contacto</Link></li>
            <li><Link to="/track" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye uppercase">Rastrear</Link></li>
          </ul>
        </div>

        {/* Right side - Cart & User */}
        <div className="navbar-end gap-2">
          {/* Admin shortcut - always visible for portfolio demo */}
          <Link 
            to="/admin" 
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-diabla-flameOrange to-diabla-fireRed text-white rounded-lg hover:scale-105 transition-transform font-burned uppercase text-xs sm:text-sm tracking-wider shadow-ember"
            title={!isAuthenticated || user?.role !== 'admin' ? 'Requiere inicio de sesión como administrador' : 'Panel de Administración'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">Admin</span>
          </Link>
          
          {/* Cart */}
          <Link to="/cart" className="btn btn-ghost btn-circle relative text-diabla-hotRed hover:text-diabla-fireRed">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="badge bg-diabla-fireRed text-white border-none absolute -top-2 -right-2 shadow-fire">{itemCount}</span>
            )}
          </Link>

          {/* User menu */}
          {isAuthenticated ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
                <div className="bg-gradient-to-br from-diabla-emberRed to-diabla-fireRed text-white rounded-full w-10 shadow-ember">
                  <span className="text-xl font-burned">{user?.name.charAt(0).toUpperCase()}</span>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-fire bg-diabla-charcoal rounded-box w-52 border border-diabla-emberRed"
              >
                <li className="menu-title">
                  <span className="text-diabla-pepperYellow font-burned">{user?.name}</span>
                </li>
                <li><Link to="/profile" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Mi Perfil</Link></li>
                <li><Link to="/orders" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Mis Pedidos</Link></li>
                {user?.role === 'admin' && (
                  <>
                    <li className="menu-title"><span className="text-diabla-flameOrange font-burned">Admin</span></li>
                    <li><Link to="/admin" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Dashboard</Link></li>
                    <li><Link to="/admin/products" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Productos</Link></li>
                    <li><Link to="/admin/orders" className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Pedidos</Link></li>
                  </>
                )}
                <li><button onClick={logout} className="text-diabla-smokeGray hover:text-diabla-fireRed font-rye">Cerrar Sesión</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-gradient-to-r from-diabla-emberRed to-diabla-hotRed text-white rounded-lg hover:scale-105 transition-transform font-burned uppercase text-sm tracking-wider shadow-ember">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
