import { useState } from 'react';
import { useProducts, useCart } from '../../hooks';
import { Loading, ErrorMessage } from '../common';
import type { Product } from '../../types';

const Menu = () => {
  const { products, categories, loading, error } = useProducts();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notification, setNotification] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setNotification(`${product.name} agregado al carrito!`);
    setTimeout(() => setNotification(''), 3000);
  };

  if (loading) return <Loading message="Cargando menu..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-diabla-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-burned font-bold mb-4 text-fire-glow uppercase tracking-widest">NUESTRO MENU</h1>
          <p className="text-xl text-diabla-flameOrange font-burned">
            Pizzas que te haran sudar 🔥
          </p>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="toast toast-top toast-center z-50">
            <div className="alert bg-diabla-fireRed text-white shadow-fire border-none">
              <span className="font-burned">✓ {notification}</span>
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
              No hay productos en esta categoria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="card card-diabla card-heat-shimmer cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="diabla-card-image"
                  />
                  {!product.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                      <span className="bg-diabla-emberRed text-white px-4 py-2 rounded-lg font-burned uppercase tracking-wider shadow-ember">No disponible</span>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-gradient-to-b from-diabla-charcoal to-diabla-black">
                  <h3 className="font-burned text-xl mb-2 line-clamp-1 text-diabla-hotRed uppercase tracking-wide">
                    {product.name}
                  </h3>
                  <p className="text-sm text-diabla-smokeGray mb-3 line-clamp-2 font-rye">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-center">
                    <span className="price-badge-fire text-xl">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DaisyUI Modal for Product Details */}
      {selectedProduct && (
        <>
          <input type="checkbox" id="product-modal" className="modal-toggle" checked={!!selectedProduct} onChange={() => {}} />
          <div className="modal modal-open" onClick={() => setSelectedProduct(null)}>
            <div className="modal-box max-w-2xl diabla-card relative" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="btn btn-sm btn-circle absolute right-4 top-4 bg-diabla-emberRed border-none hover:bg-diabla-fireRed"
              >
                ✕
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg shadow-fire"
                  />
                </div>
                
                <div>
                  <h3 className="font-burned text-3xl mb-3 text-diabla-fireRed uppercase tracking-wide">
                    {selectedProduct.name}
                  </h3>
                  
                  <div className="badge badge-warning mb-4 font-burned">
                    {selectedProduct.category}
                  </div>
                  
                  <p className="text-diabla-smokeGray mb-6 font-rye leading-relaxed">
                    {selectedProduct.description}
                  </p>
                  
                  <div className="flex justify-center mb-6">
                    <span className="price-badge-fire text-3xl">
                      ${selectedProduct.price}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={!selectedProduct.available}
                    className="diabla-button w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed !py-2 !px-4 hover:!scale-100"
                  >
                    🛒 Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;
