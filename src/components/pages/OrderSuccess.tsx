import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Loading, ErrorMessage } from '../common';
import type { Order } from '../../types';

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('ID de pedido inválido');
        setLoading(false);
        return;
      }

      try {
        const orderData = await orderService.getOrderById(parseInt(orderId));
        setOrder(orderData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <Loading message="Cargando detalles del pedido..." />;
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

  if (!order) {
    return (
      <div className="min-h-screen bg-diabla-black flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-diabla-smokeGray font-rye text-xl mb-6">Pedido no encontrado</p>
          <Link to="/menu" className="diabla-button">
            Volver al Menú
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-diabla-black py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-7xl mb-6">🔥✅</div>
          <h1 className="text-5xl font-metal font-bold mb-4 text-fire-glow uppercase tracking-widest">
            ¡PEDIDO CONFIRMADO!
          </h1>
          <p className="text-xl text-diabla-flameOrange font-burned mb-2">
            Tu orden está siendo preparada con fuego
          </p>
          <p className="text-diabla-smokeGray font-rye">
            Pedido #{order.id}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="diabla-card p-8 mb-6">
          {/* Customer Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-metal text-diabla-hotRed uppercase tracking-wider mb-4 flex items-center gap-2">
              <i className="fas fa-user"></i> Información del Cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-diabla-smokeGray font-rye">
              <div>
                <p className="text-sm text-diabla-darkGray">Nombre:</p>
                <p className="text-white font-bold">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-diabla-darkGray">Email:</p>
                <p className="text-white font-bold">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-diabla-darkGray">Teléfono:</p>
                <p className="text-white font-bold">{order.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm text-diabla-darkGray">Dirección de Entrega:</p>
                <p className="text-white font-bold">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-2xl font-metal text-diabla-hotRed uppercase tracking-wider mb-4 flex items-center gap-2">
              <i className="fas fa-pizza-slice"></i> Tu Pedido
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-diabla-charcoal rounded-lg border border-diabla-darkGray"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
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

          {/* Order Total */}
          <div className="border-t-2 border-diabla-darkGray pt-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-diabla-smokeGray font-rye">
                <span>Subtotal:</span>
                <span className="text-white">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-diabla-smokeGray font-rye">
                <span>Impuesto:</span>
                <span className="text-white">${order.tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-2xl">
              <span className="font-metal text-diabla-hotRed uppercase">Total:</span>
              <span className="price-badge-fire text-3xl">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="mt-6 p-4 bg-diabla-black rounded-lg border border-diabla-darkGray">
              <p className="text-sm text-diabla-darkGray mb-1 font-metal uppercase">Notas:</p>
              <p className="text-diabla-smokeGray font-rye">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Delivery Info */}
        <div className="diabla-card p-6 mb-6">
          <div className="flex items-center gap-4 text-diabla-smokeGray font-rye">
            <div className="text-4xl">🚀</div>
            <div>
              <p className="text-lg font-metal text-diabla-flameOrange uppercase mb-1">
                Tiempo estimado de entrega
              </p>
              <p className="text-2xl font-metal text-white">30-45 minutos</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/track" className="diabla-button justify-center">
            <i className="fas fa-map-marker-alt"></i> Rastrear Mi Pedido
          </Link>
          <Link to="/menu" className="diabla-button-outline justify-center">
            <i className="fas fa-pizza-slice"></i> Ordenar Más
          </Link>
        </div>

        {/* Email Confirmation */}
        <div className="mt-8 text-center">
          <p className="text-diabla-smokeGray font-rye text-sm">
            📧 Hemos enviado un email de confirmación a <span className="text-diabla-pepperYellow font-bold">{order.customerEmail}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
