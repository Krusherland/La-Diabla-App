import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useProducts, useCart } from '../../hooks';
import { Loading, ErrorMessage } from '../common';
import logo from '../../assets/logo.png';
import type { Product } from '../../types';

const Home = () => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Get featured products (first 6)
  const featuredProducts = products.slice(0, 6);

  if (loading) return <Loading message="Cargando pizzas deliciosas..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {/* Hero Section - Dark Dramatic */}
      <section className="hero-diabla min-h-[600px] flex items-center justify-center text-center px-4 relative">
        <div className="max-w-4xl animate-fade-in z-10">
          <div className="flex justify-center mb-6">
            <img 
              src={logo} 
              alt="La Diabla" 
              className="w-full max-w-2xl h-auto flame-wave-logo"
            />
          </div>
          <p className="text-xl md:text-3xl mb-4 text-diabla-pepperYellow font-burned tracking-wider">
            PIZZERIA DE FUEGO
          </p>
          <p className="text-lg md:text-xl mb-8 text-diabla-smokeGray font-rye">
            Sabores ardientes que te haran sudar - Pizza argentina con actitud
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link to="/menu" className="diabla-button">
              Ver Menu Picante
            </Link>
            <Link to="/locations" className="diabla-button-outline">
              Nuestras Sucursales
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - Dark Cards */}
      <section className="py-16 bg-diabla-black">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-burned font-bold text-center mb-4 text-diabla-fireRed uppercase tracking-widest">
            PIZZAS DESTACADAS
          </h2>
          <p className="text-center text-diabla-flameOrange font-burned text-xl mb-12">
            Las que mas fuego tienen 🔥
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="card card-diabla card-heat-shimmer cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="diabla-card-image"
                />
                <div className="p-6 bg-gradient-to-b from-diabla-charcoal to-diabla-black">
                  <h3 className="font-burned text-2xl mb-2 text-diabla-hotRed uppercase tracking-wide">{product.name}</h3>
                  <p className="text-diabla-smokeGray mb-4 line-clamp-2 font-rye text-sm">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="price-badge-fire text-2xl">
                      ${product.price}
                    </span>
                    <Link
                      to="/menu"
                      className="px-4 py-2 bg-gradient-to-r from-diabla-emberRed to-diabla-hotRed text-white rounded-lg hover:scale-105 transition-transform font-burned uppercase tracking-wider shadow-ember"
                    >
                      Ver +
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/menu" className="diabla-button">
              Ver Todo El Menu Infernal
            </Link>
          </div>
        </div>
      </section>

      {/* DaisyUI Modal for Product Details */}
      {selectedProduct && (
        <>
          <input type="checkbox" id="product-modal-home" className="modal-toggle" checked={!!selectedProduct} onChange={() => {}} />
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
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      disabled={!selectedProduct.available}
                      className="diabla-button w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed !py-2 !px-4 hover:!scale-100"
                    >
                      🛒 Agregar al Carrito
                    </button>
                    <Link
                      to="/menu"
                      className="diabla-button-outline w-full justify-center flex items-center !py-2 !px-4"
                      onClick={() => setSelectedProduct(null)}
                    >
                      Ver Menu
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
