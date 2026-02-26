import { Link } from 'react-router-dom';
import { useProducts, useOrders } from '../../hooks';
import { Loading } from '../common';
import type { OrderStatus } from '../../types';

const AdminDashboard = () => {
  const { products, loading: productsLoading } = useProducts();
  const { orders, loading: ordersLoading } = useOrders();

  if (productsLoading || ordersLoading) return <Loading message="Cargando panel de administración..." />;

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.available).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const readyOrders = orders.filter(o => o.status === 'ready').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: OrderStatus) => {
    const badges = {
      pending: 'bg-diabla-pepperYellow text-diabla-black',
      preparing: 'bg-diabla-flameOrange text-white',
      ready: 'bg-green-600 text-white',
      delivered: 'bg-diabla-fireRed text-white',
      cancelled: 'bg-diabla-smokeGray text-white',
    };
    return badges[status] || 'bg-gray-600 text-white';
  };

  const getStatusText = (status: OrderStatus) => {
    const texts = {
      pending: 'Pendiente',
      preparing: 'Preparando',
      ready: 'Listo',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return texts[status] || status;
  };

  return (
    <div className="space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-burned font-bold text-diabla-fireRed uppercase tracking-widest mb-2">
            PANEL DE CONTROL
          </h1>
          <p className="text-diabla-flameOrange font-burned text-base md:text-lg">
            Gestiona tu imperio de pizzas 🔥
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="admin-card-animated p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-diabla-smokeGray font-rye text-sm uppercase tracking-wider mb-1">
                Total Productos
              </p>
              <p className="text-4xl font-burned font-bold text-diabla-hotRed">
                {totalProducts}
              </p>
              <p className="text-xs text-diabla-pepperYellow mt-1 font-rye">
                {activeProducts} disponibles
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-diabla-emberRed to-diabla-fireRed rounded-lg flex items-center justify-center shadow-ember">
              <svg className="w-8 h-8 text-diabla-pepperYellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="admin-card-animated p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-diabla-smokeGray font-rye text-sm uppercase tracking-wider mb-1">
                Total Pedidos
              </p>
              <p className="text-4xl font-burned font-bold text-diabla-hotRed">
                {totalOrders}
              </p>
              <p className="text-xs text-diabla-pepperYellow mt-1 font-rye">
                En el sistema
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-diabla-flameOrange to-diabla-hotRed rounded-lg flex items-center justify-center shadow-ember">
              <svg className="w-8 h-8 text-diabla-pepperYellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="admin-card-animated p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-diabla-smokeGray font-rye text-sm uppercase tracking-wider mb-1">
                Ingresos Totales
              </p>
              <p className="text-4xl font-burned font-bold text-diabla-hotRed">
                ${totalRevenue.toFixed(0)}
              </p>
              <p className="text-xs text-diabla-pepperYellow mt-1 font-rye">
                {deliveredOrders} entregados
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-diabla-pepperYellow to-diabla-flameOrange rounded-lg flex items-center justify-center shadow-ember">
              <svg className="w-8 h-8 text-diabla-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Orders in Preparation */}
        <div className="admin-card-animated p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-diabla-smokeGray font-rye text-sm uppercase tracking-wider mb-1">
                En Preparación
              </p>
              <p className="text-4xl font-burned font-bold text-diabla-hotRed">
                {preparingOrders}
              </p>
              <p className="text-xs text-diabla-pepperYellow mt-1 font-rye">
                Requieren atención
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-diabla-fireRed to-diabla-emberRed rounded-lg flex items-center justify-center shadow-fire">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="admin-card-animated p-6">
        <h2 className="text-2xl font-burned font-bold text-diabla-hotRed uppercase tracking-wider mb-6">
          Estado de Pedidos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-diabla-black rounded-lg border border-diabla-pepperYellow">
            <div className="text-3xl font-burned text-diabla-pepperYellow mb-2">{pendingOrders}</div>
            <div className="text-sm font-rye text-diabla-smokeGray uppercase">Pendientes</div>
          </div>
          <div className="text-center p-4 bg-diabla-black rounded-lg border border-diabla-flameOrange">
            <div className="text-3xl font-burned text-diabla-flameOrange mb-2">{preparingOrders}</div>
            <div className="text-sm font-rye text-diabla-smokeGray uppercase">Preparando</div>
          </div>
          <div className="text-center p-4 bg-diabla-black rounded-lg border border-green-600">
            <div className="text-3xl font-burned text-green-500 mb-2">{readyOrders}</div>
            <div className="text-sm font-rye text-diabla-smokeGray uppercase">Listos</div>
          </div>
          <div className="text-center p-4 bg-diabla-black rounded-lg border border-diabla-fireRed">
            <div className="text-3xl font-burned text-diabla-fireRed mb-2">{deliveredOrders}</div>
            <div className="text-sm font-rye text-diabla-smokeGray uppercase">Entregados</div>
          </div>
          <div className="text-center p-4 bg-diabla-black rounded-lg border border-diabla-smokeGray">
            <div className="text-3xl font-burned text-diabla-smokeGray mb-2">
              {orders.filter(o => o.status === 'cancelled').length}
            </div>
            <div className="text-sm font-rye text-diabla-smokeGray uppercase">Cancelados</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 admin-card-animated p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-burned font-bold text-diabla-hotRed uppercase tracking-wider">
              Pedidos Recientes
            </h2>
            <Link to="/admin/orders" className="text-diabla-pepperYellow font-burned text-sm uppercase tracking-wider">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-diabla-smokeGray font-rye text-center py-8">
                No hay pedidos recientes
              </p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-diabla-black rounded-lg border border-diabla-darkGray"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-burned text-diabla-hotRed">
                        #{order.id}
                      </span>
                      <span className="font-rye text-diabla-smokeGray text-sm">
                        {order.customerName}
                      </span>
                    </div>
                    <div className="text-xs text-diabla-smokeGray font-rye">
                      {new Date(order.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-burned text-diabla-pepperYellow text-lg">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-burned uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="admin-card-animated p-6">
            <h2 className="text-xl font-burned font-bold text-diabla-hotRed uppercase tracking-wider mb-4">
              Acciones Rápidas
            </h2>
            <div className="space-y-3">
              <Link
                to="/admin/products"
                className="admin-button w-full justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Producto
              </Link>
              <Link
                to="/admin/orders"
                className="admin-button w-full justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Gestionar Pedidos
              </Link>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="admin-card-animated p-6">
            <h2 className="text-xl font-burned font-bold text-diabla-hotRed uppercase tracking-wider mb-4">
              Resumen de Hoy
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-diabla-darkGray">
                <span className="text-sm text-diabla-smokeGray font-rye">Pedidos Nuevos</span>
                <span className="font-burned text-diabla-pepperYellow">{pendingOrders}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-diabla-darkGray">
                <span className="text-sm text-diabla-smokeGray font-rye">En Cocina</span>
                <span className="font-burned text-diabla-flameOrange">{preparingOrders}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-diabla-darkGray">
                <span className="text-sm text-diabla-smokeGray font-rye">Para Entregar</span>
                <span className="font-burned text-green-500">{readyOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-diabla-smokeGray font-rye">Completados</span>
                <span className="font-burned text-diabla-fireRed">{deliveredOrders}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
