import { useEffect, useState } from 'react';
import type { Location } from '../../types';
import { contactService } from '../../services/contactService';
import { Loading, ErrorMessage } from '../common';

const Locations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await contactService.getLocations();
        setLocations(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar sucursales');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) return <Loading message="Cargando sucursales..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-oswald font-bold mb-4">Nuestras Sucursales</h1>
        <p className="text-xl text-gray-600">
          Encuentra la sucursal más cercana a ti
        </p>
      </div>

      {/* Delivery Info */}
      <div className="bg-diabla-red text-white rounded-lg p-8 mb-12 text-center">
        <h2 className="text-3xl font-oswald font-bold mb-4">🚀 Delivery Disponible</h2>
        <p className="text-xl mb-2">
          Entregamos en menos de 30 minutos
        </p>
        <p className="text-lg">
          Cobertura en toda la zona de Buenos Aires
        </p>
      </div>

      {/* Locations Grid */}
      {locations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            Pronto abriremos nuevas sucursales. ¡Mantente atento!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div key={location.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-oswald text-2xl mb-4 text-diabla-red">
                {location.name}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-700">{location.address}</p>
                </div>

                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a
                    href={`tel:${location.phone}`}
                    className="text-diabla-red hover:underline"
                  >
                    {location.phone}
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-700">{location.hours}</p>
                </div>
              </div>

              <button className="w-full mt-6 pizza-button-outline justify-center">
                Ver en Mapa
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-oswald text-xl mb-3 text-diabla-red">
            🕐 Horarios de Atención
          </h3>
          <p className="text-gray-700">
            <strong>Lunes a Jueves:</strong> 11:00 - 23:00<br />
            <strong>Viernes y Sábado:</strong> 11:00 - 24:00<br />
            <strong>Domingo:</strong> 12:00 - 23:00
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-oswald text-xl mb-3 text-diabla-red">
            📦 Zonas de Delivery
          </h3>
          <p className="text-gray-700">
            Realizamos entregas en todo Buenos Aires y alrededores.
            Consulta disponibilidad para tu zona al momento de hacer tu pedido.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Locations;
