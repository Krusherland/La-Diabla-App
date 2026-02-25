import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks';
import { Loading, ErrorMessage } from '../common';

const Home = () => {
  const { products, loading, error } = useProducts();

  // Get featured products (first 6)
  const featuredProducts = products.slice(0, 6);

  if (loading) return <Loading message="Cargando pizzas deliciosas..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {/* Hero Section - Dark Dramatic */}
      <section className="hero-diabla min-h-[600px] flex items-center justify-center text-center px-4 relative">
        <div className="max-w-4xl animate-fade-in z-10">
          <h1 className="text-6xl md:text-8xl font-metal font-bold mb-6 text-fire-glow uppercase tracking-wide">
            🔥 LA DIABLA
          </h1>
          <p className="text-xl md:text-3xl mb-4 text-diabla-pepperYellow font-burned tracking-wider">
            PIZZERÍA DE FUEGO
          </p>
          <p className="text-lg md:text-xl mb-8 text-diabla-smokeGray font-rye">
            Sabores ardientes que te harán sudar - Pizza argentina con actitud
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/menu" className="diabla-button">
              🌶️ Ver Menú Picante
            </Link>
            <Link to="/locations" className="diabla-button-outline">
              📍 Nuestras Sucursales
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Dark Theme */}
      <section className="py-16 bg-diabla-charcoal">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 grunge-texture">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="font-metal text-2xl mb-2 text-diabla-hotRed uppercase tracking-wider">HOT & FRESH</h3>
              <p className="text-diabla-smokeGray font-rye">
                Recién horneada a 500°F con ingredientes premium
              </p>
            </div>
            <div className="text-center p-6 grunge-texture">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="font-metal text-2xl mb-2 text-diabla-hotRed uppercase tracking-wider">DELIVERY VELOZ</h3>
              <p className="text-diabla-smokeGray font-rye">
                Tu pizza ardiente en 30 minutos o menos
              </p>
            </div>
            <div className="text-center p-6 grunge-texture">
              <div className="text-6xl mb-4">🌶️</div>
              <h3 className="font-metal text-2xl mb-2 text-diabla-hotRed uppercase tracking-wider">SABOR EXTREMO</h3>
              <p className="text-diabla-smokeGray font-rye">
                Recetas argentinas con un toque infernal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Dark Cards */}
      <section className="py-16 bg-diabla-black">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-metal font-bold text-center mb-4 text-diabla-fireRed uppercase tracking-widest">
            PIZZAS DESTACADAS
          </h2>
          <p className="text-center text-diabla-flameOrange font-burned text-xl mb-12">
            Las que más fuego tienen 🔥
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="diabla-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="diabla-card-image"
                />
                <div className="p-6 bg-gradient-to-b from-diabla-charcoal to-diabla-black">
                  <h3 className="font-metal text-2xl mb-2 text-diabla-hotRed uppercase tracking-wide">{product.name}</h3>
                  <p className="text-diabla-smokeGray mb-4 line-clamp-2 font-rye text-sm">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="price-badge-fire text-2xl">
                      ${product.price}
                    </span>
                    <Link
                      to="/menu"
                      className="px-4 py-2 bg-gradient-to-r from-diabla-emberRed to-diabla-hotRed text-white rounded-lg hover:scale-105 transition-transform font-metal uppercase tracking-wider shadow-ember"
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
              🔥 Ver Todo El Menú Infernal
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Fire Theme */}
      <section className="py-20 bg-gradient-to-b from-diabla-emberRed to-diabla-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-diabla-fireRed rounded-full blur-3xl animate-heat-rise"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-diabla-flameOrange rounded-full blur-3xl animate-heat-rise" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-metal font-bold mb-6 text-fire-glow uppercase tracking-widest">
            ¿LISTO PARA QUEMARTE?
          </h2>
          <p className="text-2xl mb-8 text-diabla-pepperYellow font-burned">
            Haz tu pedido y prueba el verdadero sabor del fuego
          </p>
          <Link to="/menu" className="diabla-button text-xl">
            🌶️ ORDENAR AHORA
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
