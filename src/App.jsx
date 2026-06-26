import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ChartProvider } from './context/ChartContext';

import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Input from './pages/Input';
import Result from './pages/Result';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isGuest } = useContext(AuthContext);
  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/auth" />;
  }
  return children;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated, isGuest } = useContext(AuthContext);
  if (isAuthenticated || isGuest) {
    return <Navigate to="/" />;
  }
  return children;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      <Navbar />
      <main className="relative z-10">
        <Routes>
          <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/input" element={<ProtectedRoute><Input /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
        </Routes>
      </main>
      
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center items-center opacity-30">
        <div className="w-[80vw] h-[80vw] max-w-4xl max-h-4xl bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ChartProvider>
    </AuthProvider>
  );
}

export default App;
