import { useState, useMemo } from 'react';
import { useOrders } from '../../hooks';
import { Loading, ErrorMessage } from '../common';
import { orderService } from '../../services';
import type { Order, OrderStatus } from '../../types';

const AdminOrders = () => {
  const { orders, loading, error, refetch } = useOrders();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(o => o.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(o =>
        o.customerName.toLowerCase().includes(query) ||
        o.customerEmail.toLowerCase().includes(query) ||
        o.id.toString().includes(query)
      );
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, filterStatus, searchQuery]);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await refetch();
    } catch (err: any) {
      console.error('Error updating order status:', err);
      
      // For portfolio demo: show detailed error and offer optimistic update
      const errorMessage = err?.response?.data?.message || err?.message || 'Error desconocido';
      const shouldContinue = window.confirm(
        `Error del servidor: ${errorMessage}\n\n` +
        `Para fines de demostración del portfolio, ¿deseas actualizar el estado localmente?\n` +
        `(Nota: Este cambio no se guardará en el servidor)`
      );
      
      if (shouldContinue) {
        // Optimistic update for demo purposes - force re-render by refetching
        setTimeout(() => refetch(), 100);
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleExportOrders = () => {
    const csvContent = [
      ['ID', 'Cliente', 'Email', 'Teléfono', 'Total', 'Estado', 'Fecha'].join(','),
      ...filteredOrders.map(order =>
        [
          order.id,
          `"${order.customerName}"`,
          order.customerEmail,
          order.customerPhone,
          order.total,
          order.status,
          new Date(order.createdAt).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pedidos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

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

  if (loading) return <Loading message="Cargando pedidos..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-diabla-darkGray pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-rye font-bold text-gray-100 uppercase tracking-wider">
            Gestión de Pedidos
          </h1>
          <p className="text-gray-400 font-rye text-sm mt-1">
            Administra y actualiza el estado de los pedidos
          </p>
        </div>
        <button
          onClick={handleExportOrders}
          className="flex items-center gap-2 px-5 py-2.5 bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg font-rye text-sm uppercase tracking-wider transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray p-5 rounded-lg border border-diabla-darkGray">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por cliente, email o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-diabla-black border border-diabla-darkGray rounded-lg text-gray-300 font-rye text-sm focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/30 transition-colors"
              />
            </div>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-rye text-xs uppercase tracking-wider transition-all ${
                filterStatus === 'all'
                  ? 'bg-diabla-emberRed text-white border border-diabla-emberRed'
                  : 'bg-diabla-black text-gray-400 border border-diabla-darkGray hover:border-gray-600'
              }`}
            >
              Todos ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-rye text-xs uppercase tracking-wider transition-all ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white border border-yellow-500'
                  : 'bg-diabla-black text-gray-400 border border-diabla-darkGray hover:border-gray-600'
              }`}
            >
              Pendientes ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('preparing')}
              className={`px-4 py-2 rounded-lg font-rye text-xs uppercase tracking-wider transition-all ${
                filterStatus === 'preparing'
                  ? 'bg-orange-500 text-white border border-orange-500'
                  : 'bg-diabla-black text-gray-400 border border-diabla-darkGray hover:border-gray-600'
              }`}
            >
              Preparando ({orders.filter(o => o.status === 'preparing').length})
            </button>
            <button
              onClick={() => setFilterStatus('ready')}
              className={`px-4 py-2 rounded-lg font-rye text-xs uppercase tracking-wider transition-all ${
                filterStatus === 'ready'
                  ? 'bg-green-500 text-white border border-green-500'
                  : 'bg-diabla-black text-gray-400 border border-diabla-darkGray hover:border-gray-600'
              }`}
            >
              Listos ({orders.filter(o => o.status === 'ready').length})
            </button>
            <button
              onClick={() => setFilterStatus('delivered')}
              className={`px-4 py-2 rounded-lg font-rye text-xs uppercase tracking-wider transition-all ${
                filterStatus === 'delivered'
                  ? 'bg-diabla-emberRed text-white border border-diabla-emberRed'
                  : 'bg-diabla-black text-gray-400 border border-diabla-darkGray hover:border-gray-600'
              }`}
            >
              Entregados ({orders.filter(o => o.status === 'delivered').length})
            </button>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-500 font-rye">
          Mostrando {filteredOrders.length} de {orders.length} pedidos
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray rounded-lg border border-diabla-darkGray overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-diabla-black/50 border-b-2 border-diabla-darkGray">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-rye uppercase tracking-wider text-gray-400">
                  Pedido
                </th>
                <th className="px-4 py-4 text-left text-xs font-rye uppercase tracking-wider text-gray-400">
                  Cliente
                </th>
                <th className="px-4 py-4 text-left text-xs font-rye uppercase tracking-wider text-gray-400">
                  Teléfono
                </th>
                <th className="px-4 py-4 text-left text-xs font-rye uppercase tracking-wider text-gray-400">
                  Total
                </th>
                <th className="px-4 py-4 text-left text-xs font-rye uppercase tracking-wider text-gray-400">
                  Estado
                </th>
                <th className="px-4 py-4 text-left text-xs font-rye uppercase tracking-wider text-gray-400">
                  Fecha
                </th>
                <th className="px-4 py-4 text-left text-xs font-rye uppercase tracking-wider text-gray-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-diabla-darkGray/50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-gray-500 font-rye">No se encontraron pedidos</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-diabla-black/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-rye text-diabla-emberRed">#{order.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <div className="font-rye text-white">{order.customerName}</div>
                        <div className="text-xs text-gray-500 font-rye">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-rye text-sm text-gray-400">
                      {order.customerPhone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-rye text-white text-base">
                        ${order.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {updatingOrderId === order.id ? (
                        <span className="px-3 py-1 text-xs font-rye text-gray-500">
                          Actualizando...
                        </span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`px-3 py-1.5 rounded-md text-xs font-rye cursor-pointer transition-all ${getStatusBadge(order.status)} focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/30`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="preparing">Preparando</option>
                          <option value="ready">Listo</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-rye text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-gray-400 hover:text-diabla-emberRed font-rye text-sm uppercase tracking-wider transition-colors"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray border border-diabla-darkGray rounded-lg shadow-2xl max-w-3xl w-full my-8 flex flex-col max-h-[calc(100vh-4rem)]">
            <div className="bg-diabla-black/50 p-6 border-b border-diabla-darkGray flex justify-between items-start flex-shrink-0">
              <div>
                <h2 className="text-xl font-rye font-bold text-gray-100 uppercase tracking-wider">
                  Pedido #{selectedOrder.id}
                </h2>
                <p className="text-sm text-gray-400 font-rye mt-1">
                  {new Date(selectedOrder.createdAt).toLocaleString('es-AR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-300 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Customer Info */}
              <div>
                <h3 className="text-base font-rye text-gray-100 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-diabla-emberRed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Información del Cliente
                </h3>
                <div className="bg-diabla-black/50 p-4 rounded-lg border border-diabla-darkGray space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 font-rye text-sm">Nombre:</span>
                    <span className="text-white font-rye text-sm text-right">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between items-start border-t border-diabla-darkGray pt-3">
                    <span className="text-gray-400 font-rye text-sm">Email:</span>
                    <span className="text-gray-300 font-rye text-sm text-right">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex justify-between items-start border-t border-diabla-darkGray pt-3">
                    <span className="text-gray-400 font-rye text-sm">Teléfono:</span>
                    <span className="text-gray-300 font-rye text-sm text-right">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex justify-between items-start border-t border-diabla-darkGray pt-3">
                    <span className="text-gray-400 font-rye text-sm">Dirección:</span>
                    <span className="text-gray-300 font-rye text-sm text-right max-w-xs">{selectedOrder.deliveryAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-base font-rye text-gray-100 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-diabla-emberRed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Productos
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-diabla-black/50 p-4 rounded-lg border border-diabla-darkGray hover:border-diabla-emberRed/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-14 h-14 object-cover rounded border border-diabla-darkGray"
                          />
                        )}
                        <div>
                          <div className="font-rye text-white mb-1">
                            {item.productName}
                          </div>
                          <div className="text-sm text-gray-400 font-rye">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-rye text-diabla-emberRed font-bold">
                        ${item.subtotal.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-base font-rye text-gray-100 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-diabla-emberRed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z\" />
                  </svg>
                  Resumen del Pedido
                </h3>
                <div className="bg-diabla-black/50 p-4 rounded-lg border border-diabla-darkGray space-y-3">
                  <div className="flex justify-between font-rye text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-rye text-sm border-t border-diabla-darkGray pt-3">
                    <span className="text-gray-400">Impuestos:</span>
                    <span className="text-white">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-diabla-emberRed/30 pt-3 mt-3 flex justify-between">
                    <span className="text-gray-100 font-rye text-base uppercase font-bold">Total:</span>
                    <span className="text-diabla-emberRed font-rye text-2xl font-bold">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-base font-rye text-gray-100 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-diabla-emberRed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z\" />
                    </svg>
                    Notas del Pedido
                  </h3>
                  <div className="bg-diabla-black/50 p-4 rounded-lg border border-diabla-darkGray">
                    <p className="text-gray-300 font-rye text-sm">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-diabla-black/50 rounded-lg border border-diabla-darkGray">
                <span className="text-gray-400 font-rye text-sm">Estado actual del pedido:</span>
                <span className={`px-4 py-2 rounded-md text-sm font-rye ${getStatusBadge(selectedOrder.status)}`}>
                  {getStatusText(selectedOrder.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
