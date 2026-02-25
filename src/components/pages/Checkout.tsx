import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../../hooks';
import { orderService } from '../../services/orderService';
import type { CreateOrderData } from '../../types';

const DELIVERY_FEE = 500;

interface PromoCode {
  type: 'percent' | 'fixed' | 'delivery';
  value: number;
}

const PROMO_CODES: Record<string, PromoCode> = {
  'DIABLA10': { type: 'percent', value: 10 },
  'FUEGO15': { type: 'percent', value: 15 },
  'PRIMERAORDEN': { type: 'percent', value: 20 },
  'ENVIOGRATIS': { type: 'delivery', value: 0 },
  'DESCUENTO500': { type: 'fixed', value: 500 },
};

const CITIES = [
  'Buenos Aires',
  'Córdoba',
  'Rosario',
  'Mendoza',
  'La Plata',
  'Mar del Plata',
  'San Miguel de Tucumán',
  'Salta',
];

const Checkout = () => {
  const { cart, clearCart, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryZipCode, setDeliveryZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderNotes, setOrderNotes] = useState('');
  const [promoCode, setPromoCode] = useState('');

  // State
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (itemCount === 0) {
      navigate('/cart');
    }
  }, [itemCount, navigate]);

  // Calculate totals
  const subtotal = cart.subtotal;
  const deliveryFee = DELIVERY_FEE;
  const total = subtotal + deliveryFee - discount;

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    
    if (!code) {
      showNotification('error', 'Ingrese un código promocional');
      return;
    }

    if (appliedPromo === code) {
      showNotification('error', 'Este código ya está aplicado');
      return;
    }

    const promo = PROMO_CODES[code];
    
    if (!promo) {
      showNotification('error', 'Código promocional inválido');
      return;
    }

    let discountValue = 0;
    if (promo.type === 'percent') {
      discountValue = subtotal * (promo.value / 100);
      showNotification('success', `¡Código aplicado! ${promo.value}% de descuento`);
    } else if (promo.type === 'fixed') {
      discountValue = promo.value;
      showNotification('success', `¡Código aplicado! $${promo.value} de descuento`);
    } else if (promo.type === 'delivery') {
      // Free delivery handled separately
      showNotification('success', '¡Envío gratis aplicado!');
    }

    setDiscount(discountValue);
    setAppliedPromo(code);
    setPromoCode('');
  };

  const handleRemovePromo = () => {
    setDiscount(0);
    setAppliedPromo('');
    showNotification('success', 'Código promocional removido');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress || !deliveryCity) {
      showNotification('error', 'Por favor complete todos los campos requeridos');
      return;
    }

    if (cart.items.length === 0) {
      showNotification('error', 'Tu carrito está vacío');
      return;
    }

    setLoading(true);

    try {
      const orderData: CreateOrderData = {
        items: cart.items,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress: `${deliveryAddress}, ${deliveryCity}${deliveryZipCode ? ', CP: ' + deliveryZipCode : ''}`,
        paymentMethod: paymentMethod as 'cash' | 'card' | 'transfer' | 'mercadopago',
        deliveryFee: 0,
        notes: orderNotes || undefined,
      };

      const order = await orderService.createOrder(orderData);
      
      // Clear cart
      clearCart();
      
      // Show success and redirect
      showNotification('success', '¡Pedido realizado con éxito!');
      
      // Redirect to order success page
      setTimeout(() => {
        navigate(`/order-success/${order.id}`);
      }, 1500);
      
    } catch (error: any) {
      showNotification('error', error.message || 'Error al procesar el pedido. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-diabla-black py-12">
      {/* Notification Toast */}
      {notification && (
        <div className="toast toast-top toast-center z-50">
          <div className={`alert ${notification.type === 'success' ? 'bg-diabla-fireRed' : 'bg-diabla-emberRed'} text-white shadow-fire border-none`}>
            <span className="font-metal">
              {notification.type === 'success' ? '✓' : '✗'} {notification.message}
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-metal font-bold mb-8 text-fire-glow uppercase tracking-widest text-center">
          <i className="fas fa-fire"></i> FINALIZAR PEDIDO
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="diabla-card p-6">
                <h2 className="text-2xl font-metal mb-6 text-diabla-hotRed uppercase tracking-wider flex items-center gap-2">
                  <i className="fas fa-user"></i> Información Personal
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-diabla-smokeGray font-rye mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      placeholder="Juan Pérez"
                      className="w-full px-4 py-3 bg-diabla-charcoal border border-diabla-darkGray rounded-lg text-white font-rye focus:border-diabla-fireRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-diabla-smokeGray font-rye mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                        placeholder="juan@ejemplo.com"
                        className="w-full px-4 py-3 bg-diabla-charcoal border border-diabla-darkGray rounded-lg text-white font-rye focus:border-diabla-fireRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-diabla-smokeGray font-rye mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                        placeholder="11 1234-5678"
                        className="w-full px-4 py-3 bg-diabla-charcoal border border-diabla-darkGray rounded-lg text-white font-rye focus:border-diabla-fireRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="diabla-card p-6">
                <h2 className="text-2xl font-metal mb-6 text-diabla-hotRed uppercase tracking-wider flex items-center gap-2">
                  <i className="fas fa-map-marker-alt"></i> Dirección de Entrega
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-diabla-smokeGray font-rye mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                      placeholder="Calle Falsa 123, Piso 4, Depto B"
                      className="w-full px-4 py-3 bg-diabla-charcoal border border-diabla-darkGray rounded-lg text-white font-rye focus:border-diabla-fireRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-diabla-smokeGray font-rye mb-2">
                        Ciudad *
                      </label>
                      <select
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-diabla-charcoal border border-diabla-darkGray rounded-lg text-white font-rye focus:border-diabla-fireRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed transition-all"
                      >
                        <option value="">Seleccione...</option>
                        {CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-diabla-smokeGray font-rye mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={deliveryZipCode}
                        onChange={(e) => setDeliveryZipCode(e.target.value)}
                        placeholder="1650"
                        pattern="[0-9]{4}"
                        className="w-full px-4 py-3 bg-diabla-charcoal border border-diabla-darkGray rounded-lg text-white font-rye focus:border-diabla-fireRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="diabla-card p-6">
                <h2 className="text-2xl font-metal mb-6 text-diabla-hotRed uppercase tracking-wider flex items-center gap-2">
                  <i className="fas fa-credit-card"></i> Método de Pago
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`relative flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-diabla-fireRed bg-diabla-charcoal shadow-ember' : 'border-diabla-darkGray bg-diabla-black hover:border-diabla-emberRed'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="radio radio-error"
                    />
                    <div className="flex items-center gap-2 text-diabla-smokeGray font-rye">
                      <i className="fas fa-money-bill-wave text-diabla-flameOrange"></i>
                      <span>Efectivo</span>
                    </div>
                  </label>

                  <label className={`relative flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-diabla-fireRed bg-diabla-charcoal shadow-ember' : 'border-diabla-darkGray bg-diabla-black hover:border-diabla-emberRed'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="radio radio-error"
                    />
                    <div className="flex items-center gap-2 text-diabla-smokeGray font-rye">
                      <i className="fas fa-credit-card text-diabla-flameOrange"></i>
                      <span>Tarjeta</span>
                    </div>
                  </label>

                  <label className={`relative flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-diabla-fireRed bg-diabla-charcoal shadow-ember' : 'border-diabla-darkGray bg-diabla-black hover:border-diabla-emberRed'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="radio radio-error"
                    />
                    <div className="flex items-center gap-2 text-diabla-smokeGray font-rye">
                      <i className="fas fa-university text-diabla-flameOrange"></i>
                      <span>Transferencia</span>
                    </div>
                  </label>

                  <label className={`relative flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'mercadopago' ? 'border-diabla-fireRed bg-diabla-charcoal shadow-ember' : 'border-diabla-darkGray bg-diabla-black hover:border-diabla-emberRed'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mercadopago"
                      checked={paymentMethod === 'mercadopago'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="radio radio-error"
                    />
                    <div className="flex items-center gap-2 text-diabla-smokeGray font-rye">
                      <i className="fas fa-wallet text-diabla-flameOrange"></i>
                      <span>Mercado Pago</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="diabla-card p-6">
                <h2 className="text-2xl font-metal mb-6 text-diabla-hotRed uppercase tracking-wider flex items-center gap-2">
                  <i className="fas fa-comment"></i> Notas del Pedido
                </h2>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={3}
                  placeholder="Ej: Sin cebolla, timbre roto, etc. (Opcional)"
                  className="w-full px-4 py-3 bg-diabla-charcoal border border-diabla-darkGray rounded-lg text-white font-rye focus:border-diabla-fireRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed transition-all resize-none"
                />
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="diabla-card p-6 sticky top-24">
                <h2 className="text-2xl font-metal mb-6 text-diabla-hotRed uppercase tracking-wider flex items-center gap-2">
                  <i className="fas fa-receipt"></i> Resumen
                </h2>

                {/* Order Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 pb-3 border-b border-diabla-darkGray">
                      <img
                        src={item.product.image || '/images/placeholder.svg'}
                        alt={item.product.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.svg';
                        }}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-metal text-diabla-smokeGray uppercase">{item.product.name}</p>
                        <p className="text-xs text-diabla-smokeGray font-rye">
                          {item.quantity} x ${item.product.price}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-diabla-pepperYellow">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  {!appliedPromo ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Código de descuento"
                        className="flex-1 px-3 py-2 bg-diabla-charcoal border border-diabla-darkGray rounded-lg text-white font-rye text-sm focus:border-diabla-fireRed focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-gradient-to-r from-diabla-emberRed to-diabla-hotRed text-white rounded-lg hover:scale-105 transition-transform font-metal uppercase text-xs tracking-wider shadow-ember"
                      >
                        Aplicar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-diabla-charcoal border border-diabla-fireRed rounded-lg">
                      <span className="text-sm text-diabla-pepperYellow font-metal">
                        <i className="fas fa-tag"></i> {appliedPromo}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-diabla-hotRed hover:text-diabla-fireRed text-xs font-metal"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-diabla-smokeGray font-rye">
                    <span>Subtotal:</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-diabla-smokeGray font-rye">
                    <span>Envío:</span>
                    <span className="font-bold">${deliveryFee.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-diabla-flameOrange font-rye">
                      <span>Descuento:</span>
                      <span className="font-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-diabla-darkGray pt-3 flex justify-between text-xl">
                    <span className="font-metal text-diabla-hotRed uppercase tracking-wider">Total:</span>
                    <span className="price-badge-fire text-2xl">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full diabla-button justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle"></i> Confirmar Pedido
                    </>
                  )}
                </button>

                {/* Additional Info */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-diabla-smokeGray text-sm font-rye">
                    <i className="fas fa-clock text-diabla-flameOrange"></i>
                    <span>Tiempo estimado: 30-45 min</span>
                  </div>
                  <div className="flex items-center gap-2 text-diabla-smokeGray text-sm font-rye">
                    <i className="fas fa-lock text-diabla-flameOrange"></i>
                    <span>Pago seguro y protegido</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
