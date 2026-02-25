import { useState } from 'react';
import { useProducts, useCart } from '../../hooks';
import { Loading, ErrorMessage } from '../common';
import type { Product } from '../../types';

const Menu = () => {
  const { products, categories, loading, error } = useProducts();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notification, setNotification] = useState<string>('');

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setNotification(`${product.name} agregado al carrito!`);
    setTimeout(() => setNotification(''), 3000);
  };

  if (loading) return <Loading message="Cargando menú..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-diabla-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-metal font-bold mb-4 text-fire-glow uppercase tracking-widest">NUESTRO MENÚ</h1>
          <p className="text-xl text-diabla-flameOrange font-burned">
            Pizzas que te harán sudar 🔥
          </p>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="toast toast-top toast-center z-50">
            <div className="alert bg-diabla-fireRed text-white shadow-fire border-none">
              <span className="font-metal">✓ {notification}</span>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'diabla-button' : 'diabla-button-outline'}
          >
            🔥 Todas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={selectedCategory === category.name ? 'diabla-button' : 'diabla-button-outline'}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-diabla-smokeGray font-rye">
              No hay productos en esta categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="diabla-card">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="diabla-card-image"
                  />
                  {!product.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                      <span className="bg-diabla-emberRed text-white px-4 py-2 rounded-lg font-metal uppercase tracking-wider shadow-ember">No disponible</span>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-gradient-to-b from-diabla-charcoal to-diabla-black">
                  <h3 className="font-metal text-xl mb-2 line-clamp-1 text-diabla-hotRed uppercase tracking-wide">
                    {product.name}
                  </h3>
                  <p className="text-sm text-diabla-smokeGray mb-3 line-clamp-2 font-rye">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="price-badge-fire text-xl">
                      ${product.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.available}
                      className="px-3 py-2 bg-gradient-to-r from-diabla-emberRed to-diabla-hotRed text-white rounded-lg hover:scale-105 transition-transform font-metal uppercase text-xs tracking-wider shadow-ember disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
