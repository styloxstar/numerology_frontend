import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChartContext } from '../context/ChartContext';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Input() {
  const { isGuest } = useContext(AuthContext);
  const { createChart, generateGuestChart } = useContext(ChartContext);
  const navigate = useNavigate();
  
  const [profileName, setProfileName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dateOfBirth) return;
    setLoading(true);
    setError('');

    try {
      if (!profileName) {
        setError('Profile Name is required for comprehensive numerology.');
        setLoading(false);
        return;
      }
      
      if (isGuest) {
        await generateGuestChart(profileName, dateOfBirth);
        navigate('/result');
      } else {
        const newChart = await createChart(profileName, dateOfBirth);
        navigate('/result', { state: { chartData: newChart } });
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 sm:p-6 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-6 sm:p-8 w-full max-w-lg relative overflow-hidden"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Calculate Numerology</h2>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                <AlertCircle className="shrink-0" size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 group">
            <label className="text-sm font-medium text-white/60 ml-1 group-focus-within:text-primary transition-colors">Profile Name (Full Name at Birth)</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full px-4 py-3 bg-surface/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all placeholder:text-white/20 text-white"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2 group">
            <label className="text-sm font-medium text-white/60 ml-1 group-focus-within:text-primary transition-colors">Date of Birth</label>
            <div className="w-full">
              <DatePicker
                selected={dateOfBirth ? new Date(dateOfBirth) : null}
                onChange={(date) => {
                  if (date) {
                    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                    setDateOfBirth(localDate.toISOString().split('T')[0]);
                  } else {
                    setDateOfBirth('');
                  }
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select your birth date"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={new Date()}
                className="w-full px-4 py-3 bg-surface/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all text-white placeholder:text-white/20"
                wrapperClassName="w-full"
                required
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="mt-6 flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-secondary to-primary text-background font-black tracking-wide rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-wait text-lg shadow-[0_0_20px_rgba(var(--color-secondary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-secondary),0.5)] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Calculating...</span>
              </>
            ) : (
              <span>{isGuest ? 'Generate Guest Chart' : 'Save & Calculate'}</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
