import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../utils/config';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFaToken, setTwoFaToken] = useState('');
  const [show2Fa, setShow2Fa] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, token: show2Fa ? twoFaToken : undefined }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Invalid credentials');
      }

      const data = await response.json();
      
      if (data.requires2FA) {
          setShow2Fa(true);
          setIsLoading(false);
          return;
      }

      login(data.token, username);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background photo */}
        <img
          src="https://images.unsplash.com/photo-1586002613567-2e6be6c5e89a?auto=format&fit=crop&w=1400&q=80"
          alt="Sri Lanka"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-ceylon-900/80 via-ceylon-800/60 to-black/40" />

        {/* Decorative animated blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-ceylon-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full bg-ceylon-300/20 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 flex flex-col justify-between p-14 h-full"
        >
          {/* Logo area */}
          <div>
            <span className="text-white/90 font-serif text-2xl font-bold tracking-widest">RELIC LANKA</span>
            <span className="block text-ceylon-300 text-xs uppercase tracking-widest mt-1">Admin Portal</span>
          </div>

          {/* Tagline */}
          <div>
            <h2 className="text-5xl font-serif font-bold text-white leading-tight mb-4">
              Manage your<br />
              <span className="text-ceylon-300 italic">paradise</span><br />
              from here.
            </h2>
            <p className="text-white/70 text-base max-w-xs leading-relaxed">
              Log in to curate tours, manage bookings, and share Sri Lanka's timeless beauty with the world.
            </p>
            {/* Decorative dots row */}
            <div className="flex gap-2 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full bg-ceylon-300/60 ${i === 0 ? 'w-8' : 'w-3'}`} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#faf8f5] px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <span className="text-primary font-serif text-2xl font-bold tracking-widest">RELIC LANKA</span>
            <span className="block text-ceylon-600 text-xs uppercase tracking-widest mt-1">Admin Portal</span>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Welcome back.</h1>
            <p className="text-gray-500">Sign in to continue to the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-ceylon-600 transition-colors" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ceylon-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            {!show2Fa && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-ceylon-600 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ceylon-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ceylon-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* 2FA Token */}
            {show2Fa && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Authenticator Code</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-ceylon-600 transition-colors" />
                    <input
                      type="text"
                      required
                      value={twoFaToken}
                      onChange={(e) => setTwoFaToken(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ceylon-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm transition-all tracking-widest text-xl text-center"
                    />
                  </div>
                </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"
              >
                <span className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 inline-block" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-ceylon-700 hover:bg-ceylon-800 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-ceylon-700/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer note */}
          <p className="mt-10 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Relic Lanka Tours · Admin Access Only
          </p>
        </motion.div>
      </div>
    </div>
  );
};
