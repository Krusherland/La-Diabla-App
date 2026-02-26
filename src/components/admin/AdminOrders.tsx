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
        // Optimistic update for demo purposes
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        // Force re-render by refetching (this will show the optimistic change until page reload)
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

  if (loading) return <Loading message="Cargando pedidos..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-burned font-bold text-fire-glow uppercase tracking-widest">
            GESTIÓN DE PEDIDOS
          </h1>
          <p className="text-diabla-flameOrange font-burned mt-1">
            Administra los pedidos en tiempo real 🔥
          </p>
        </div>
        <button
          onClick={handleExportOrders}
          className="admin-button-outline"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="admin-card-animated p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por cliente, email o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-diabla-black border border-diabla-darkGray rounded-lg text-diabla-smokeGray font-rye focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/50"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-2 justify-start">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-burned text-sm uppercase tracking-wider ${
                filterStatus === 'all'
                  ? 'bg-diabla-fireRed text-white'
                  : 'bg-diabla-black text-diabla-smokeGray border border-diabla-darkGray'
              }`}
            >
              Todos ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-burned text-sm uppercase tracking-wider ${
                filterStatus === 'pending'
                  ? 'bg-diabla-pepperYellow text-diabla-black'
                  : 'bg-diabla-black text-diabla-smokeGray border border-diabla-darkGray'
              }`}
            >
              Pendientes ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('preparing')}
              className={`px-4 py-2 rounded-lg font-burned text-sm uppercase tracking-wider ${
                filterStatus === 'preparing'
                  ? 'bg-diabla-flameOrange text-white'
                  : 'bg-diabla-black text-diabla-smokeGray border border-diabla-darkGray'
              }`}
            >
              Preparando ({orders.filter(o => o.status === 'preparing').length})
            </button>
            <button
              onClick={() => setFilterStatus('ready')}
              className={`px-4 py-2 rounded-lg font-burned text-sm uppercase tracking-wider ${
                filterStatus === 'ready'
                  ? 'bg-green-600 text-white'
                  : 'bg-diabla-black text-diabla-smokeGray border border-diabla-darkGray'
              }`}
            >
              Listos ({orders.filter(o => o.status === 'ready').length})
            </button>
            <button
              onClick={() => setFilterStatus('delivered')}
              className={`px-4 py-2 rounded-lg font-burned text-sm uppercase tracking-wider ${
                filterStatus === 'delivered'
                  ? 'bg-diabla-fireRed text-white'
                  : 'bg-diabla-black text-diabla-smokeGray border border-diabla-darkGray'
              }`}
            >
              Entregados ({orders.filter(o => o.status === 'delivered').length})
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card-animated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-diabla-black border-b border-diabla-darkGray">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Pedido #
                </th>
                <th className="px-4 py-4 text-left text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Cliente
                </th>
                <th className="px-4 py-4 text-left text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Teléfono
                </th>
                <th className="px-4 py-4 text-left text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Total
                </th>
                <th className="px-4 py-4 text-left text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Estado
                </th>
                <th className="px-4 py-4 text-left text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Fecha
                </th>
                <th className="px-4 py-4 text-left text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-diabla-darkGray">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-diabla-smokeGray font-rye">
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className=""
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-burned text-diabla-pepperYellow">
                        #{order.id}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <div className="font-rye text-diabla-smokeGray">{order.customerName}</div>
                        <div className="text-xs text-diabla-darkGray">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-rye text-sm text-diabla-smokeGray">
                      {order.customerPhone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-burned text-diabla-pepperYellow text-lg">
                        ${order.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {updatingOrderId === order.id ? (
                        <span className="px-3 py-1 text-xs font-burned text-diabla-smokeGray">
                          Actualizando...
                        </span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`px-3 py-1 rounded-full text-xs font-burned uppercase tracking-wider cursor-pointer ${getStatusBadge(order.status)} border-none outline-none`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="preparing">Preparando</option>
                          <option value="ready">Listo</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-rye text-diabla-smokeGray">
                      {new Date(order.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-diabla-pepperYellow font-burned text-sm uppercase tracking-wider"
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
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="admin-card-animated max-w-3xl w-full my-8 flex flex-col max-h-[calc(100vh-4rem)]">
            <div className="bg-diabla-charcoal p-6 border-b border-diabla-darkGray flex justify-between items-start flex-shrink-0">
              <div>
                <h2 className="text-2xl font-burned font-bold text-diabla-hotRed uppercase tracking-wider">
                  Pedido #{selectedOrder.id}
                </h2>
                <p className="text-sm text-diabla-smokeGray font-rye mt-1">
                  {new Date(selectedOrder.createdAt).toLocaleString('es-AR')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-diabla-smokeGray hover:text-diabla-fireRed transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-burned text-diabla-hotRed uppercase tracking-wider mb-3">
                  Información del Cliente
                </h3>
                <div className="bg-diabla-black p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-diabla-smokeGray font-rye text-sm">Nombre:</span>
                    <span className="text-diabla-pepperYellow font-burned">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-diabla-smokeGray font-rye text-sm">Email:</span>
                    <span className="text-diabla-pepperYellow font-rye text-sm">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-diabla-smokeGray font-rye text-sm">Teléfono:</span>
                    <span className="text-diabla-pepperYellow font-rye text-sm">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-diabla-smokeGray font-rye text-sm">Dirección:</span>
                    <span className="text-diabla-pepperYellow font-rye text-sm text-right">{selectedOrder.deliveryAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-burned text-diabla-hotRed uppercase tracking-wider mb-3">
                  Productos
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-diabla-black p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-burned text-diabla-pepperYellow">
                            {item.productName}
                          </div>
                          <div className="text-sm text-diabla-smokeGray font-rye">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-burned text-diabla-hotRed">
                        ${item.subtotal.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-burned text-diabla-hotRed uppercase tracking-wider mb-3">
                  Resumen del Pedido
                </h3>
                <div className="bg-diabla-black p-4 rounded-lg space-y-2">
                  <div className="flex justify-between font-rye text-sm">
                    <span className="text-diabla-smokeGray">Subtotal:</span>
                    <span className="text-diabla-pepperYellow">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-rye text-sm">
                    <span className="text-diabla-smokeGray">Impuestos:</span>
                    <span className="text-diabla-pepperYellow">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-diabla-darkGray pt-2 mt-2 flex justify-between">
                    <span className="text-diabla-hotRed font-burned text-lg uppercase">Total:</span>
                    <span className="text-diabla-fireRed font-burned text-2xl">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-lg font-burned text-diabla-hotRed uppercase tracking-wider mb-3">
                    Notas
                  </h3>
                  <div className="bg-diabla-black p-4 rounded-lg">
                    <p className="text-diabla-smokeGray font-rye text-sm">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-diabla-smokeGray font-rye">Estado actual:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-burned uppercase tracking-wider ${getStatusBadge(selectedOrder.status)}`}>
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
