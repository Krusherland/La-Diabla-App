const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-burned font-bold mb-4 text-diabla-fireRed">Nosotros</h1>
        <p className="text-xl text-diabla-smokeGray max-w-3xl mx-auto">
          La pasion por la pizza artesanal hecha tradicion
        </p>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="diabla-card rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-burned font-bold mb-6 text-diabla-fireRed">
            Nuestra Historia
          </h2>
          <div className="space-y-4 text-diabla-smokeGray leading-relaxed">
            <p>
              <strong className="text-diabla-flameOrange">La Diabla Pizzeria</strong> nacio en 2015 con un sueno simple pero ambicioso:
              crear las mejores pizzas artesanales de Buenos Aires. Inspirados en la tradicion
              italiana y con un toque argentino unico, comenzamos a hornear nuestras primeras
              pizzas en un pequeno local del barrio.
            </p>
            <p>
              Hoy, despues de anos de dedicacion y el amor de nuestros clientes, nos hemos
              convertido en una de las pizzerias mas queridas de la ciudad. Nuestro secreto
              es simple: ingredientes de primera calidad, masa artesanal preparada diariamente,
              y un equipo apasionado que pone el corazon en cada pizza.
            </p>
            <p>
              El nombre "La Diabla" representa nuestra pasion por los sabores intensos y
              autenticos, el fuego de nuestro horno artesanal, y la energia que ponemos en
              cada preparacion. No es solo pizza, es una experiencia que queremos compartir
              contigo.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-burned font-bold text-center mb-12 text-diabla-fireRed">
          Nuestros Valores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="diabla-card rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="font-burned text-xl mb-3 text-diabla-hotRed">Calidad</h3>
            <p className="text-diabla-smokeGray">
              Seleccionamos cuidadosamente cada ingrediente para garantizar el mejor sabor
              en cada bocado.
            </p>
          </div>
          <div className="diabla-card rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🔥</div>
            <h3 className="font-burned text-xl mb-3 text-diabla-hotRed">Pasion</h3>
            <p className="text-diabla-smokeGray">
              Amamos lo que hacemos y eso se refleja en cada pizza que sale de nuestro horno.
            </p>
          </div>
          <div className="diabla-card rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="font-burned text-xl mb-3 text-diabla-hotRed">Compromiso</h3>
            <p className="text-diabla-smokeGray">
              Tu satisfaccion es nuestra prioridad. Trabajamos para superarnos cada dia.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-diabla-charcoal rounded-lg p-8 text-center border border-diabla-hotRed/20">
        <h2 className="text-3xl font-burned font-bold mb-6 text-diabla-fireRed">Nuestro Equipo</h2>
        <p className="text-diabla-smokeGray max-w-2xl mx-auto mb-8">
          Detras de cada pizza hay un equipo de profesionales apasionados: maestros pizzeros,
          cocineros expertos, y un equipo de atencion al cliente dedicado a brindarte la mejor
          experiencia.
        </p>
        <p className="text-lg font-burned text-diabla-flameOrange">
          Gracias por elegirnos y ser parte de la familia La Diabla! 🔥
        </p>
      </div>
    </div>
  );
};

export default About;
