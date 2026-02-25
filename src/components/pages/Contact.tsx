import { useState } from 'react';
import type { FormEvent } from 'react';
import { contactService } from '../../services/contactService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await contactService.submitContactForm(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-oswald font-bold mb-4">Contacto</h1>
        <p className="text-xl text-gray-600">
          ¿Tienes alguna pregunta? ¡Estamos aquí para ayudarte!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-oswald font-bold mb-6">Envíanos un Mensaje</h2>

          {success && (
            <div className="alert alert-success mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>¡Mensaje enviado con éxito! Te responderemos pronto.</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">Nombre</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-diabla-red"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-diabla-red"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Teléfono</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-diabla-red"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Mensaje</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-diabla-red min-h-[150px]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full pizza-button justify-center"
            >
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-oswald font-bold mb-6">Información de Contacto</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-diabla-red text-white rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-oswald text-lg mb-1">Teléfono</h3>
                  <p className="text-gray-600">(011) 4567-8900</p>
                  <p className="text-gray-600">Lun - Dom: 11:00 - 23:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-diabla-red text-white rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-oswald text-lg mb-1">Email</h3>
                  <p className="text-gray-600">info@ladiabla.com</p>
                  <p className="text-gray-600">ventas@ladiabla.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-diabla-red text-white rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-oswald text-lg mb-1">Ubicación</h3>
                  <p className="text-gray-600">Buenos Aires, Argentina</p>
                  <p className="text-gray-600">Ver nuestras sucursales</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-diabla-gold rounded-lg p-6 text-center">
            <h3 className="font-oswald text-2xl mb-2">Horarios de Atención</h3>
            <p className="text-lg">Lunes a Domingo</p>
            <p className="text-3xl font-bold mt-2">11:00 - 23:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
