import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { orderService } from '../../services/orderService';
import { Loading, ErrorMessage } from '../common';
import type { Order, OrderStatus } from '../../types';

const MyOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/orders');
      return;
    }

    const fetchOrders = async () => {
      if (!user?.email) return;

      try {
        const userOrders = await orderService.getUserOrders(user.email);
        setOrders(userOrders);
      } catch (err: any) {
        setError(err.message || 'Error al cargar tus pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated, navigate]);

  const getStatusBadge = (status: OrderStatus) => {
    const badges = {
      pending: 'bg-diabla-pepperYellow text-diabla-black',
      preparing: 'bg-diabla-flameOrange text-white',
      ready: 'bg-green-600 text-white',
      delivered: 'bg-diabla-fireRed text-white',
      cancelled: 'bg-gray-600 text-white',
    };
    return badges[status] || 'bg-gray-600 text-white';
  };

  const getStatusText = (status: OrderStatus) => {
    const texts = {
      pending: 'Pendiente',
      preparing: 'En Preparación',
      ready: 'Listo para Entrega',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons = {
      pending: '⏳',
      preparing: '👨‍🍳🔥',
      ready: '✅',
      delivered: '🚀',
      cancelled: '❌',
    };
    return icons[status] || '📦';
  };

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return <Loading message="Cargando tus pedidos..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-diabla-black flex items-center justify-center px-4">
        <div className="text-center">
          <ErrorMessage message={error} />
          <Link to="/menu" className="diabla-button mt-6">
            Volver al Menú
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-diabla-black py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-metal font-bold mb-4 text-fire-glow uppercase tracking-widest">
            🔥 MIS PEDIDOS
          </h1>
          <p className="text-diabla-flameOrange font-burned text-xl">
            Rastrea el estado de tus pedidos ardientes
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="diabla-card p-12 text-center">
            <div className="text-7xl mb-6">🍕</div>
            <h2 className="text-3xl font-metal text-diabla-hotRed mb-4 uppercase">
              No tienes pedidos aún
            </h2>
            <p className="text-diabla-smokeGray font-rye mb-6">
              ¿Qué estás esperando? ¡Pide una pizza diabólicamente deliciosa!
            </p>
            <Link to="/menu" className="diabla-button">
              🔥 Ver Menú
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="diabla-card overflow-hidden transition-all hover:shadow-2xl hover:shadow-diabla-emberRed/30"
              >
                {/* Order Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-metal text-diabla-hotRed uppercase">
                          Pedido #{order.id}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-metal uppercase ${getStatusBadge(order.status)}`}>
                          {getStatusIcon(order.status)} {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-diabla-smokeGray font-rye text-sm">
                        {new Date(order.createdAt).toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Order Total */}
                    <div className="text-right">
                      <p className="text-diabla-smokeGray font-rye text-sm mb-1">Total:</p>
                      <p className="price-badge-fire text-2xl">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>

                    {/* Expand Icon */}
                    <button className="text-diabla-hotRed hover:text-diabla-fireRed transition-colors">
                      <svg
                        className={`w-6 h-6 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Quick Order Preview */}
                  {expandedOrderId !== order.id && (
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      <span className="text-diabla-smokeGray font-rye text-sm">
                        {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}:
                      </span>
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.productImage || '/images/placeholder.svg'}
                            alt={item.productName}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder.svg';
                            }}
                            className="w-10 h-10 rounded-full border-2 border-diabla-charcoal object-cover"
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 rounded-full border-2 border-diabla-charcoal bg-diabla-emberRed flex items-center justify-center text-white font-metal text-xs">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Order Details */}
                {expandedOrderId === order.id && (
                  <div className="border-t-2 border-diabla-darkGray p-6 bg-diabla-charcoal animate-fade-in">
                    {/* Tracking Timeline */}
                    <div className="mb-8">
                      <h4 className="text-xl font-metal text-diabla-hotRed uppercase mb-6">
                        🔥 Estado del Pedido
                      </h4>
                      <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-1 bg-diabla-darkGray">
                          <div
                            className="h-full bg-gradient-to-r from-diabla-emberRed to-diabla-fireRed transition-all duration-500"
                            style={{
                              width: order.status === 'pending' ? '0%' :
                                     order.status === 'preparing' ? '33%' :
                                     order.status === 'ready' ? '66%' :
                                     order.status === 'delivered' ? '100%' : '0%'
                            }}
                          />
                        </div>

                        {/* Timeline Steps */}
                        {[
                          { status: 'pending', label: 'Recibido', icon: '📝' },
                          { status: 'preparing', label: 'Preparando', icon: '👨‍🍳' },
                          { status: 'ready', label: 'Listo', icon: '✅' },
                          { status: 'delivered', label: 'Entregado', icon: '🚀' }
                        ].map((step, idx) => {
                          const isActive = order.status === step.status;
                          const isPassed = ['pending', 'preparing', 'ready', 'delivered'].indexOf(order.status) >=
                                          ['pending', 'preparing', 'ready', 'delivered'].indexOf(step.status);
                          
                          return (
                            <div key={idx} className="flex flex-col items-center relative z-10">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-metal text-sm transition-all ${
                                isActive 
                                  ? 'bg-diabla-fireRed text-white shadow-fire scale-110' 
                                  : isPassed
                                  ? 'bg-diabla-emberRed text-white'
                                  : 'bg-diabla-darkGray text-diabla-smokeGray'
                              }`}>
                                {step.icon}
                              </div>
                              <span className={`text-xs font-rye mt-2 ${
                                isActive || isPassed ? 'text-diabla-pepperYellow' : 'text-diabla-smokeGray'
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                      <h4 className="text-xl font-metal text-diabla-hotRed uppercase mb-4">
                        📦 Tu Pedido
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-3 bg-diabla-black rounded-lg border border-diabla-darkGray"
                          >
                            <img
                              src={item.productImage || '/images/placeholder.svg'}
                              alt={item.productName}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/placeholder.svg';
                              }}
                              className="w-16 h-16 object-cover rounded-lg shadow-ember"
                            />
                            <div className="flex-1">
                              <p className="font-metal text-diabla-hotRed uppercase">{item.productName}</p>
                              <p className="text-sm text-diabla-smokeGray font-rye">
                                {item.quantity} x ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <span className="price-badge-fire">
                              ${item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="p-4 bg-diabla-black rounded-lg border border-diabla-darkGray">
                        <h5 className="text-sm font-metal text-diabla-flameOrange uppercase mb-2">
                          📍 Dirección de Entrega
                        </h5>
                        <p className="text-diabla-smokeGray font-rye text-sm">
                          {order.deliveryAddress}
                        </p>
                      </div>
                      <div className="p-4 bg-diabla-black rounded-lg border border-diabla-darkGray">
                        <h5 className="text-sm font-metal text-diabla-flameOrange uppercase mb-2">
                          📞 Contacto
                        </h5>
                        <p className="text-diabla-smokeGray font-rye text-sm">
                          {order.customerPhone}
                        </p>
                        <p className="text-diabla-smokeGray font-rye text-sm">
                          {order.customerEmail}
                        </p>
                      </div>
                    </div>

                    {/* Order Notes */}
                    {order.notes && (
                      <div className="p-4 bg-diabla-black rounded-lg border border-diabla-darkGray mb-6">
                        <h5 className="text-sm font-metal text-diabla-flameOrange uppercase mb-2">
                          📝 Notas del Pedido
                        </h5>
                        <p className="text-diabla-smokeGray font-rye text-sm">
                          {order.notes}
                        </p>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="p-4 bg-diabla-black rounded-lg border-2 border-diabla-emberRed">
                      <div className="space-y-2">
                        <div className="flex justify-between text-diabla-smokeGray font-rye">
                          <span>Subtotal:</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-diabla-smokeGray font-rye">
                          <span>Impuesto:</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl pt-2 border-t border-diabla-darkGray">
                          <span className="font-metal text-diabla-hotRed uppercase">Total:</span>
                          <span className="price-badge-fire text-2xl">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
