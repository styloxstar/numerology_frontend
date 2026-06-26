import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChartContext } from '../context/ChartContext';
import { motion } from 'framer-motion';
import { Trash2, Plus, ArrowRight } from 'lucide-react';

export default function Home() {
  const { isGuest, email } = useContext(AuthContext);
  const { charts, fetchCharts, deleteChart } = useContext(ChartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isGuest) fetchCharts();
  }, [isGuest]);

  if (isGuest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
          <h1 className="text-4xl font-bold mb-4">Explore Numerology</h1>
          <p className="text-white/60 mb-8">You are currently in guest mode. Your charts will not be saved.</p>
          <Link to="/input" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-bold rounded-full hover:bg-primary/90 transition-colors">
            Calculate a Chart <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Charts</h1>
          <p className="text-white/60">Logged in as {email}</p>
        </div>
        <Link to="/input" className="flex items-center gap-2 px-6 py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          <Plus size={20} /> New Chart
        </Link>
      </header>

      {charts.length === 0 ? (
        <div className="text-center py-20 glass-panel">
          <p className="text-white/50 text-lg">You haven't saved any charts yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charts.map((chart) => (
            <motion.div
              key={chart._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-6 flex flex-col gap-4 group cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => navigate(`/result`, { state: { chartData: chart.chartData } })}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{chart.profileName}</h3>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteChart(chart._id); }}
                  className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 p-2 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-white/50 text-sm">Born: {new Date(chart.dateOfBirth).toLocaleDateString()}</p>
              
              <div className="mt-auto pt-4 flex gap-2">
                <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-primary border border-primary/20">Life Path {chart.chartData.lifePath}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
