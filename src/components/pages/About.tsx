const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-oswald font-bold mb-4">Nosotros</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          La pasión por la pizza artesanal hecha tradición
        </p>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-oswald font-bold mb-6 text-diabla-red">
            Nuestra Historia
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>La Diabla Pizzería</strong> nació en 2015 con un sueño simple pero ambicioso:
              crear las mejores pizzas artesanales de Buenos Aires. Inspirados en la tradición
              italiana y con un toque argentino único, comenzamos a hornear nuestras primeras
              pizzas en un pequeño local del barrio.
            </p>
            <p>
              Hoy, después de años de dedicación y el amor de nuestros clientes, nos hemos
              convertido en una de las pizzerías más queridas de la ciudad. Nuestro secreto
              es simple: ingredientes de primera calidad, masa artesanal preparada diariamente,
              y un equipo apasionado que pone el corazón en cada pizza.
            </p>
            <p>
              El nombre "La Diabla" representa nuestra pasión por los sabores intensos y
              auténticos, el fuego de nuestro horno artesanal, y la energía que ponemos en
              cada preparación. No es solo pizza, es una experiencia que queremos compartir
              contigo.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-oswald font-bold text-center mb-12">
          Nuestros Valores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="font-oswald text-xl mb-3 text-diabla-red">Calidad</h3>
            <p className="text-gray-600">
              Seleccionamos cuidadosamente cada ingrediente para garantizar el mejor sabor
              en cada bocado.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">❤️</div>
            <h3 className="font-oswald text-xl mb-3 text-diabla-red">Pasión</h3>
            <p className="text-gray-600">
              Amamos lo que hacemos y eso se refleja en cada pizza que sale de nuestro horno.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="font-oswald text-xl mb-3 text-diabla-red">Compromiso</h3>
            <p className="text-gray-600">
              Tu satisfacción es nuestra prioridad. Trabajamos para superarnos cada día.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-oswald font-bold mb-6">Nuestro Equipo</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Detrás de cada pizza hay un equipo de profesionales apasionados: maestros pizzeros,
          cocineros expertos, y un equipo de atención al cliente dedicado a brindarte la mejor
          experiencia.
        </p>
        <p className="text-lg font-oswald text-diabla-red">
          ¡Gracias por elegirnos y ser parte de la familia La Diabla! 🔥
        </p>
      </div>
    </div>
  );
};

export default About;
