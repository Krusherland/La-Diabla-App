import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-diabla-black py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-burned font-bold text-fire-glow mb-4 uppercase tracking-wider animate-pulse">
            🔥 LA DIABLA
          </h1>
          <h2 className="text-3xl font-burned text-diabla-pepperYellow mb-2">Crear Cuenta</h2>
          <p className="text-diabla-smokeGray mt-2 font-rye">
            Unete a nosotros y disfruta de nuestras pizzas
          </p>
        </div>

        <div className="bg-gradient-to-b from-diabla-charcoal to-diabla-black rounded-lg shadow-fire border-2 border-diabla-emberRed p-8">
          {error && (
            <div className="bg-diabla-hotRed border-2 border-diabla-fireRed text-white rounded-lg p-4 mb-6 flex items-center gap-3 shadow-ember">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-rye">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="text-diabla-pepperYellow font-burned uppercase tracking-wider text-sm">Nombre completo *</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input w-full bg-diabla-black border-2 border-diabla-emberRed text-white focus:outline-none focus:border-diabla-fireRed focus:ring-2 focus:ring-diabla-hotRed placeholder-diabla-smokeGray"
                placeholder="Juan Perez"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label">
                <span className="text-diabla-pepperYellow font-burned uppercase tracking-wider text-sm">Email *</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input w-full bg-diabla-black border-2 border-diabla-emberRed text-white focus:outline-none focus:border-diabla-fireRed focus:ring-2 focus:ring-diabla-hotRed placeholder-diabla-smokeGray"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="text-diabla-pepperYellow font-burned uppercase tracking-wider text-sm">Telefono</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input w-full bg-diabla-black border-2 border-diabla-emberRed text-white focus:outline-none focus:border-diabla-fireRed focus:ring-2 focus:ring-diabla-hotRed placeholder-diabla-smokeGray"
                placeholder="(011) 1234-5678"
              />
            </div>

            <div>
              <label className="label">
                <span className="text-diabla-pepperYellow font-burned uppercase tracking-wider text-sm">Direccion</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input w-full bg-diabla-black border-2 border-diabla-emberRed text-white focus:outline-none focus:border-diabla-fireRed focus:ring-2 focus:ring-diabla-hotRed placeholder-diabla-smokeGray"
                placeholder="Calle 123, Buenos Aires"
              />
            </div>

            <div>
              <label className="label">
                <span className="text-diabla-pepperYellow font-burned uppercase tracking-wider text-sm">Contrasena *</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input w-full bg-diabla-black border-2 border-diabla-emberRed text-white focus:outline-none focus:border-diabla-fireRed focus:ring-2 focus:ring-diabla-hotRed placeholder-diabla-smokeGray"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <label className="label">
                <span className="text-diabla-smokeGray text-xs font-rye">
                  Minimo 6 caracteres
                </span>
              </label>
            </div>

            <div>
              <label className="label">
                <span className="text-diabla-pepperYellow font-burned uppercase tracking-wider text-sm">Confirmar contrasena *</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="input w-full bg-diabla-black border-2 border-diabla-emberRed text-white focus:outline-none focus:border-diabla-fireRed focus:ring-2 focus:ring-diabla-hotRed placeholder-diabla-smokeGray"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full diabla-button justify-center mt-6"
            >
              {loading ? '🔥 Creando cuenta...' : '🔥 Crear Cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-diabla-smokeGray font-rye">
              Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-diabla-fireRed hover:text-diabla-pepperYellow font-burned uppercase tracking-wider transition-colors">
                Inicia sesion aqui
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-diabla-smokeGray hover:text-diabla-flameOrange font-rye transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-diabla-emberRed to-diabla-hotRed border-2 border-diabla-fireRed rounded-lg p-4 shadow-fire">
          <p className="text-sm text-white font-rye">
            <strong className="font-burned uppercase tracking-wider">🔥 Demo:</strong> Esta es una aplicacion de demostracion.
            El backend debe estar configurado para que el registro funcione.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
