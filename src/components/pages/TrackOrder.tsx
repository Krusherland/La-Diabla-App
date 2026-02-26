import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Order, OrderStatus } from '../../types';
import { orderService } from '../../services/orderService';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const data = await orderService.trackOrder(parseInt(orderId), email);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Pedido no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: OrderStatus) => {
    const texts = {
      pending: 'Pendiente',
      preparing: 'En Preparacion',
      ready: 'Listo',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return texts[status];
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons = {
      pending: '⏰',
      preparing: '🔥🍕',
      ready: '✅',
      delivered: '🚀',
      cancelled: '❌',
    };
    return icons[status];
  };

  return (
    <div className="min-h-screen bg-diabla-black py-12">
      <div className="container mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-burned font-bold mb-4 text-fire-glow uppercase tracking-widest">RASTREAR PEDIDO</h1>
        <p className="text-xl text-diabla-flameOrange font-burned">
          Ingresa tu numero de pedido y email para ver el estado
        </p>
      </div>

      {/* Track Form */}
      <div className="max-w-md mx-auto mb-12">
        <div className="bg-gradient-to-b from-diabla-charcoal to-diabla-black rounded-lg shadow-fire border-2 border-diabla-emberRed p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="text-diabla-pepperYellow font-burned uppercase tracking-wider text-sm">Numero de Pedido</span>
              </label>
              <input
                type="number"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="input w-full bg-diabla-black border-2 border-diabla-emberRed text-white focus:outline-none focus:border-diabla-fireRed focus:ring-2 focus:ring-diabla-hotRed placeholder-diabla-smokeGray"
                placeholder="ej: 12345"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="text-diabla-pepperYellow font-burned uppercase tracking-wider text-sm">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full bg-diabla-black border-2 border-diabla-emberRed text-white focus:outline-none focus:border-diabla-fireRed focus:ring-2 focus:ring-diabla-hotRed placeholder-diabla-smokeGray"
                placeholder="tu@email.com"
                required
              />
            </div>

            {error && (
              <div className="bg-diabla-hotRed border-2 border-diabla-fireRed text-white rounded-lg p-4 flex items-center gap-3 shadow-ember">
                <span className="font-rye">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full diabla-button justify-center"
            >
              {loading ? '🔍 Buscando...' : '🔍 Rastrear Pedido'}
            </button>
          </form>
        </div>
      </div>

      {/* Order Details */}
      {order && (
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Status Section */}
          <div className="diabla-card p-8 mb-8 text-center">
            <div className="text-7xl mb-4">{getStatusIcon(order.status)}</div>
            <h2 className="text-4xl font-burned font-bold mb-4 text-fire-glow uppercase">
              PEDIDO #{order.id}
            </h2>
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-diabla-emberRed to-diabla-hotRed border-2 border-diabla-fireRed shadow-fire mb-4">
              <span className="text-white font-burned text-lg uppercase tracking-wider">
                {getStatusText(order.status)}
              </span>
            </div>
            <p className="mt-4 text-diabla-smokeGray font-rye">
              Pedido realizado: {new Date(order.createdAt).toLocaleString('es-AR')}
            </p>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="diabla-card p-6">
              <h3 className="font-burned text-2xl mb-4 text-diabla-hotRed uppercase tracking-wider">
                👤 Cliente
              </h3>
              <div className="space-y-2 text-diabla-smokeGray font-rye">
                <p><span className="text-diabla-pepperYellow font-burned">Nombre:</span> {order.customerName}</p>
                <p><span className="text-diabla-pepperYellow font-burned">Email:</span> {order.customerEmail}</p>
                <p><span className="text-diabla-pepperYellow font-burned">Telefono:</span> {order.customerPhone}</p>
              </div>
            </div>

            <div className="diabla-card p-6">
              <h3 className="font-burned text-2xl mb-4 text-diabla-hotRed uppercase tracking-wider">
                📍 Entrega
              </h3>
              <p className="text-diabla-smokeGray font-rye">{order.deliveryAddress}</p>
              {order.notes && (
                <div className="mt-4 p-3 bg-diabla-black rounded border border-diabla-darkGray">
                  <p className="text-xs text-diabla-darkGray font-burned uppercase mb-1">Notas:</p>
                  <p className="text-diabla-smokeGray font-rye text-sm">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="diabla-card p-6 mb-8">
            <h3 className="font-burned text-2xl mb-6 text-diabla-hotRed uppercase tracking-wider flex items-center gap-2">
              🍕 Detalles del Pedido
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-diabla-charcoal rounded-lg border border-diabla-darkGray">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-lg shadow-ember"
                  />
                  <div className="flex-1">
                    <h4 className="font-burned text-lg text-diabla-hotRed uppercase">{item.productName}</h4>
                    <p className="text-diabla-smokeGray font-rye">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="price-badge-fire text-xl">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-diabla-darkGray pt-6 mt-6 space-y-2">
              <div className="flex justify-between text-diabla-smokeGray font-rye">
                <span>Subtotal:</span>
                <span className="text-white">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-diabla-smokeGray font-rye">
                <span>Impuesto:</span>
                <span className="text-white">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-2xl pt-2">
                <span className="font-burned text-diabla-hotRed uppercase">Total:</span>
                <span className="price-badge-fire text-3xl">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default TrackOrder;
