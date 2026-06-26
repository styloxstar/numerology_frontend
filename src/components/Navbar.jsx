import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Star } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, isGuest, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center py-6 px-8 bg-surface/50 backdrop-blur-sm border-b border-white/5 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3 text-2xl font-black text-primary tracking-tighter hover:scale-105 transition-transform">
        <Star className="text-accent" fill="currentColor" />
        Numerology
      </Link>
      
      {(isAuthenticated || isGuest) && (
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          {isGuest ? 'Exit Guest Mode' : 'Logout'}
        </button>
      )}
    </nav>
  );
}
