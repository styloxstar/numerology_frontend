import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Auth() {
  const { login, register, loginAsGuest } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) await login(email, password);
      else await register(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && <div className="p-3 mb-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 bg-background/50 border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-colors text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 bg-background/50 border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-colors text-white"
            required
          />
          <button 
            disabled={loading}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-sm text-white/60 hover:text-white transition-colors"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-white/40 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <button 
          onClick={loginAsGuest}
          className="w-full px-6 py-3 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors"
        >
          Continue as Guest
        </button>
      </motion.div>
    </div>
  );
}
