import { Link, useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../../hooks';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-diabla-black flex items-center justify-center px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-4xl font-burned font-bold mb-4 text-diabla-hotRed uppercase">Tu carrito esta vacio</h2>
          <p className="text-diabla-smokeGray mb-8 font-rye">
            Agrega algunas pizzas deliciosas a tu carrito!
          </p>
          <Link to="/menu" className="diabla-button">
            🔥 Ver Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-diabla-black py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-burned font-bold mb-8 text-fire-glow uppercase tracking-widest">
          🛒 CARRITO DE COMPRAS
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="diabla-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-burned text-diabla-hotRed uppercase">
                  {itemCount} {itemCount === 1 ? 'Producto' : 'Productos'}
                </h2>
                <button onClick={clearCart} className="px-3 py-2 text-diabla-hotRed hover:text-diabla-fireRed font-burned uppercase text-sm border border-diabla-emberRed hover:border-diabla-fireRed rounded-lg transition-all">
                  Vaciar Carrito
                </button>
              </div>

              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 border-b border-diabla-darkGray last:border-b-0"
                  >
                    <img
                      src={item.product.image || '/images/placeholder.svg'}
                      alt={item.product.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.svg';
                      }}
                      className="w-24 h-24 object-cover rounded-lg shadow-ember"
                    />
                    <div className="flex-1">
                      <h3 className="font-burned text-lg font-bold mb-1 text-diabla-hotRed uppercase">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-diabla-smokeGray mb-2 font-rye">
                        ${item.product.price} c/u
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border-2 border-diabla-emberRed text-diabla-hotRed hover:bg-diabla-emberRed hover:text-white rounded-full transition-all font-burned"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-diabla-pepperYellow font-burned">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border-2 border-diabla-emberRed text-diabla-hotRed hover:bg-diabla-emberRed hover:text-white rounded-full transition-all font-burned"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-8 h-8 flex items-center justify-center text-diabla-hotRed hover:text-diabla-fireRed transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <span className="price-badge-fire">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="diabla-card p-6 sticky top-24">
              <h2 className="text-2xl font-burned mb-6 text-diabla-hotRed uppercase tracking-wider">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-diabla-smokeGray font-rye">
                  <span>Subtotal:</span>
                  <span className="font-bold text-white">${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-diabla-smokeGray font-rye">
                  <span>Impuesto (10%):</span>
                  <span className="font-bold text-white">${cart.tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-diabla-darkGray pt-3 flex justify-between text-xl">
                  <span className="font-burned text-diabla-hotRed uppercase">Total:</span>
                  <span className="price-badge-fire text-2xl">
                    ${cart.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button onClick={handleCheckout} className="w-full diabla-button justify-center mb-4">
                🔥 Proceder al Pago
              </button>

              <Link
                to="/menu"
                className="block text-center text-diabla-flameOrange hover:text-diabla-fireRed transition-colors font-rye underline"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
