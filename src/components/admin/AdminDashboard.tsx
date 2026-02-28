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
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const averageOrderValue = deliveredOrders > 0 ? totalRevenue / deliveredOrders : 0;

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Calculate order trend for simple bar chart
  const ordersByStatus = [
    { label: 'Pendientes', count: pendingOrders, color: 'bg-yellow-500', textColor: 'text-yellow-500' },
    { label: 'Preparando', count: preparingOrders, color: 'bg-orange-500', textColor: 'text-orange-500' },
    { label: 'Listos', count: readyOrders, color: 'bg-green-500', textColor: 'text-green-500' },
    { label: 'Entregados', count: deliveredOrders, color: 'bg-diabla-emberRed', textColor: 'text-diabla-emberRed' },
    { label: 'Cancelados', count: cancelledOrders, color: 'bg-gray-500', textColor: 'text-gray-500' },
  ];
  const maxOrders = Math.max(...ordersByStatus.map(s => s.count), 1);

  const getStatusBadge = (status: OrderStatus) => {
    const badges = {
      pending: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30',
      preparing: 'bg-orange-500/10 text-orange-600 border border-orange-500/30',
      ready: 'bg-green-500/10 text-green-600 border border-green-500/30',
      delivered: 'bg-red-500/10 text-red-600 border border-red-500/30',
      cancelled: 'bg-gray-500/10 text-gray-500 border border-gray-500/30',
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
      <div className="flex justify-between items-center border-b border-diabla-darkGray pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-rye font-bold text-gray-100 uppercase tracking-wider mb-2">
            Panel de Control
          </h1>
          <p className="text-gray-400 font-rye text-sm md:text-base">
            Sistema de administración La Diabla
          </p>
        </div>
        <div className="text-right text-sm text-gray-400 font-rye">
          <div>{new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray p-6 rounded-lg border border-diabla-darkGray hover:border-diabla-emberRed/50 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-diabla-emberRed/20 rounded-lg flex items-center justify-center border border-diabla-emberRed/30">
              <svg className="w-6 h-6 text-diabla-emberRed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-gray-400 font-rye text-xs uppercase tracking-wider mb-2">
              Total Productos
            </p>
            <p className="text-3xl font-rye font-bold text-white mb-1">
              {totalProducts}
            </p>
            <p className="text-xs text-diabla-emberRed font-rye">
              {activeProducts} activos
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray p-6 rounded-lg border border-diabla-darkGray hover:border-orange-500/50 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/30">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-gray-400 font-rye text-xs uppercase tracking-wider mb-2">
              Total Pedidos
            </p>
            <p className="text-3xl font-rye font-bold text-white mb-1">
              {totalOrders}
            </p>
            <p className="text-xs text-orange-500 font-rye">
              {pendingOrders + preparingOrders + readyOrders} activos
            </p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray p-6 rounded-lg border border-diabla-darkGray hover:border-green-500/50 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-gray-400 font-rye text-xs uppercase tracking-wider mb-2">
              Ingresos Totales
            </p>
            <p className="text-3xl font-rye font-bold text-white mb-1">
              ${totalRevenue.toFixed(0)}
            </p>
            <p className="text-xs text-green-500 font-rye">
              {deliveredOrders} completados
            </p>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray p-6 rounded-lg border border-diabla-darkGray hover:border-yellow-500/50 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-gray-400 font-rye text-xs uppercase tracking-wider mb-2">
              Valor Promedio
            </p>
            <p className="text-3xl font-rye font-bold text-white mb-1">
              ${averageOrderValue.toFixed(0)}
            </p>
            <p className="text-xs text-yellow-500 font-rye">
              por pedido
            </p>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown with Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Chart */}
        <div className="lg:col-span-2 bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray p-6 rounded-lg border border-diabla-darkGray">
          <h2 className="text-lg font-rye font-bold text-gray-100 uppercase tracking-wider mb-6">
            Distribución de Pedidos
          </h2>
          <div className="space-y-4">
            {ordersByStatus.map((status) => (
              <div key={status.label} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className={`font-rye ${status.textColor}`}>{status.label}</span>
                  <span className="font-rye text-gray-400">{status.count} pedidos</span>
                </div>
                <div className="w-full bg-diabla-black/50 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${status.color} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{ width: `${(status.count / maxOrders) * 100}%` }}
                  >
                    {status.count > 0 && (
                      <span className="text-[10px] font-bold text-white/90"></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Summary */}
        <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray p-6 rounded-lg border border-diabla-darkGray">
          <h2 className="text-lg font-rye font-bold text-gray-100 uppercase tracking-wider mb-6">
            Resumen de Estado
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-diabla-black/50 rounded-lg border border-yellow-500/30">
              <span className="text-sm text-gray-300 font-rye">Pendientes</span>
              <span className="font-rye text-xl text-yellow-500">{pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-diabla-black/50 rounded-lg border border-orange-500/30">
              <span className="text-sm text-gray-300 font-rye">Preparando</span>
              <span className="font-rye text-xl text-orange-500">{preparingOrders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-diabla-black/50 rounded-lg border border-green-500/30">
              <span className="text-sm text-gray-300 font-rye">Listos</span>
              <span className="font-rye text-xl text-green-500">{readyOrders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-diabla-black/50 rounded-lg border border-diabla-emberRed/30">
              <span className="text-sm text-gray-300 font-rye">Entregados</span>
              <span className="font-rye text-xl text-diabla-emberRed">{deliveredOrders}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray p-6 rounded-lg border border-diabla-darkGray">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-rye font-bold text-gray-100 uppercase tracking-wider">
              Actividad Reciente
            </h2>
            <Link 
              to="/admin/orders" 
              className="text-diabla-emberRed hover:text-diabla-fireRed font-rye text-sm uppercase tracking-wider transition-colors flex items-center gap-1"
            >
              Ver todos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="space-y-2">
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 font-rye">No hay pedidos recientes</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-diabla-black/50 rounded-lg border border-diabla-darkGray hover:border-diabla-emberRed/40 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-diabla-emberRed/20 rounded-lg flex items-center justify-center border border-diabla-emberRed/30">
                      <span className="font-rye text-sm text-diabla-emberRed">#{order.id}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-rye text-gray-200 text-sm mb-1">
                        {order.customerName}
                      </div>
                      <div className="text-xs text-gray-500 font-rye">
                        {new Date(order.createdAt).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-rye text-gray-200 text-base">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className={`px-3 py-1 rounded-md text-xs font-rye uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray p-6 rounded-lg border border-diabla-darkGray">
            <h2 className="text-lg font-rye font-bold text-gray-100 uppercase tracking-wider mb-4">
              Acciones Rápidas
            </h2>
            <div className="space-y-3">
              <Link
                to="/admin/products"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-diabla-emberRed/20 hover:bg-diabla-emberRed hover:scale-[1.02] text-diabla-emberRed hover:text-white border border-diabla-emberRed/30 hover:border-diabla-emberRed rounded-lg font-rye text-sm uppercase tracking-wider transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Producto
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-orange-500/20 hover:bg-orange-500 hover:scale-[1.02] text-orange-500 hover:text-white border border-orange-500/30 hover:border-orange-500 rounded-lg font-rye text-sm uppercase tracking-wider transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Gestionar Pedidos
              </Link>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray p-6 rounded-lg border border-diabla-darkGray">
            <h2 className="text-lg font-rye font-bold text-gray-100 uppercase tracking-wider mb-4">
              Estado del Sistema
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-diabla-darkGray">
                <span className="text-sm text-gray-400 font-rye">Productos Activos</span>
                <span className="font-rye text-green-500">{activeProducts}/{totalProducts}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-diabla-darkGray">
                <span className="text-sm text-gray-400 font-rye">Pedidos Activos</span>
                <span className="font-rye text-orange-500">{pendingOrders + preparingOrders + readyOrders}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-diabla-darkGray">
                <span className="text-sm text-gray-400 font-rye">Completados Hoy</span>
                <span className="font-rye text-diabla-emberRed">{deliveredOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400 font-rye">Valor Promedio</span>
                <span className="font-rye text-yellow-500">${averageOrderValue.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
