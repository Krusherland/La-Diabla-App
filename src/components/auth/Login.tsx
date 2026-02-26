import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email o contraseña incorrectos');
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
          <h2 className="text-3xl font-burned text-diabla-pepperYellow mb-2">Iniciar Sesion</h2>
          <p className="text-diabla-smokeGray mt-2 font-rye">
            Ingresa a tu cuenta para continuar
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">
                <span className="text-diabla-pepperYellow font-burned uppercase tracking-wider">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full bg-diabla-black border-2 border-diabla-emberRed text-white focus:outline-none focus:border-diabla-fireRed focus:ring-2 focus:ring-diabla-hotRed placeholder-diabla-smokeGray"
                placeholder="tu@email.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label">
                <span className="text-diabla-pepperYellow font-burned uppercase tracking-wider">Contrasena</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full bg-diabla-black border-2 border-diabla-emberRed text-white focus:outline-none focus:border-diabla-fireRed focus:ring-2 focus:ring-diabla-hotRed placeholder-diabla-smokeGray"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full diabla-button justify-center"
            >
              {loading ? '🔥 Iniciando sesion...' : '🔥 Iniciar Sesion'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-diabla-smokeGray font-rye">
              No tienes una cuenta?{' '}
              <Link to="/register" className="text-diabla-fireRed hover:text-diabla-pepperYellow font-burned uppercase tracking-wider transition-colors">
                Registrate aqui
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
          <p className="text-sm text-white font-rye mb-3">
            <strong className="font-burned uppercase tracking-wider">🔥 Demo:</strong> Esta es una aplicacion de demostracion.
          </p>
          <div className="bg-diabla-black bg-opacity-50 rounded p-3 border border-diabla-pepperYellow">
            <p className="text-xs text-diabla-pepperYellow font-burned uppercase tracking-wider mb-2">
              Credenciales de prueba:
            </p>
            <p className="text-sm text-white font-mono">
              <span className="text-diabla-flameOrange">Email:</span> admin@admin.com
            </p>
            <p className="text-sm text-white font-mono">
              <span className="text-diabla-flameOrange">Password:</span> admin1234
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
