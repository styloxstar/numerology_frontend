import { useState, useContext } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { ChartContext } from '../context/ChartContext';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, X, Loader2 } from 'lucide-react';
import { exportChartToPDF } from '../utils/pdfExport';

const Modal = ({ item, onClose }) => {
  if (!item) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-panel p-6 sm:p-8 bg-surface border border-white/20 shadow-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl sm:text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary pr-10">
            {item.title}
          </h2>
          <div className="text-4xl sm:text-5xl font-black text-white/90 mb-6 drop-shadow-lg border-b border-white/10 pb-6">
            {item.value}
          </div>
          
          <div className="space-y-6 text-white/80 leading-relaxed text-base sm:text-lg">
            <div>
              <h4 className="text-sm uppercase tracking-widest text-primary mb-2">The Core Reading</h4>
              <p className="italic border-l-4 border-primary/50 pl-4">{item.reading}</p>
            </div>
            
            {item.deepDetails && (
              <div>
                <h4 className="text-sm uppercase tracking-widest text-secondary mb-2">Deep Numerological Analysis</h4>
                <p>{item.deepDetails}</p>
              </div>
            )}
            
            {item.example && (
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="text-sm uppercase tracking-widest text-white/60 mb-2">Real-World Manifestation</h4>
                <p className="text-white/90">{item.example}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const NumberCard = ({ title, numberObj, description, delay, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    onClick={() => onClick({
      title, 
      value: numberObj?.value ?? numberObj,
      reading: numberObj?.reading ?? "Deep numerological reading processing...",
      deepDetails: numberObj?.deepDetails,
      example: numberObj?.example
    })}
    className="glass-panel p-5 sm:p-6 flex flex-col relative overflow-hidden group h-full cursor-pointer hover:-translate-y-1 transition-transform break-inside-avoid"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <h3 className="text-lg sm:text-xl font-bold text-white/90 mb-1 group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-xs text-white/50 mb-4">{description}</p>
    
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mt-auto">
      <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary drop-shadow-lg shrink-0">
        {numberObj?.value ?? numberObj}
      </span>
      <p className="text-sm text-white/80 leading-relaxed italic sm:border-l-2 sm:border-white/10 sm:pl-4 line-clamp-3">
        {numberObj?.reading ?? "Click for details..."}
      </p>
    </div>
    
    <div className="mt-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity text-right">
      Tap for Deep Details →
    </div>
  </motion.div>
);

const CycleCard = ({ title, data, delay, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="glass-panel p-5 sm:p-6 h-full flex flex-col relative overflow-hidden group break-inside-avoid"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
    <h3 className="text-lg sm:text-xl font-bold mb-6 text-white text-center">{title}</h3>
    <div className="flex flex-wrap sm:flex-nowrap justify-around items-center gap-3 mt-auto mb-2">
      {Object.entries(data).map(([key, val]) => (
        <div 
          key={key} 
          onClick={() => onClick({
            title: `${title} - ${key.toUpperCase()}`,
            value: val.value,
            reading: val.reading,
            deepDetails: val.deepDetails,
            example: val.example
          })}
          className="flex flex-col items-center p-3 bg-surface/50 rounded-lg border border-white/5 text-center cursor-pointer hover:bg-white/10 hover:-translate-y-1 transition-all w-full sm:w-auto flex-1"
        >
          <span className="text-xs text-white/50 uppercase tracking-widest mb-1">{key}</span>
          <span className="text-2xl font-bold text-primary mb-2">{val.value}</span>
          <p className="text-[10px] text-white/70 italic leading-tight text-center sm:text-left sm:border-t sm:border-white/10 pt-2 line-clamp-2 w-full">{val.reading}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

const ArrayCard = ({ title, numbers, description, delay, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-panel p-5 sm:p-6 flex flex-col items-center text-center relative overflow-hidden group h-full break-inside-avoid"
  >
    <h3 className="text-base sm:text-lg font-bold text-white/80 mb-4">{title}</h3>
    {numbers && numbers.length > 0 ? (
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {numbers.map((n, i) => (
          <span key={i} className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-orange-400 drop-shadow-lg">
            {n}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-xl sm:text-2xl font-bold text-white/40 mb-4 py-2">None</span>
    )}
    <p className="text-xs sm:text-sm text-white/60 leading-relaxed mt-auto">{description}</p>
  </motion.div>
);

const SectionHeading = ({ title }) => (
  <div className="w-full mt-12 sm:mt-16 mb-6 sm:mb-8 flex items-center gap-4 break-after-avoid px-2">
    <div className="h-px bg-white/10 flex-grow"></div>
    <h2 className="text-xl sm:text-2xl font-black text-white/90 tracking-widest uppercase text-center">{title}</h2>
    <div className="h-px bg-white/10 flex-grow"></div>
  </div>
);

export default function Result() {
  const { currentGuestChart } = useContext(ChartContext);
  const { isGuest } = useContext(AuthContext);
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    setIsExporting(true);
    // Add a tiny delay so the UI updates to show the loader before heavy PDF processing blocks the main thread
    await new Promise(resolve => setTimeout(resolve, 50));
    try {
      exportChartToPDF(chartDataWrapper, data.core?.lifePath?.value ? "Your" : "");
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const chartDataWrapper = isGuest ? currentGuestChart : location.state?.chartData;

  if (!chartDataWrapper) {
    return <Navigate to="/" />;
  }

  const data = chartDataWrapper.chartData || chartDataWrapper;

  if (!data.core) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-xl font-bold text-red-400">Old Chart Format Detected</h2>
        <p className="text-white/60 mb-6">This chart was generated before the comprehensive update. Please generate a new one.</p>
        <Link to="/input" className="px-6 py-3 bg-primary text-background font-bold rounded-lg">Generate New Chart</Link>
      </div>
    );
  }

  return (
    <div id="chart-report" className="p-4 sm:p-8 max-w-6xl mx-auto mb-20 relative bg-background overflow-x-hidden">
      {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      
      <div className="flex justify-between items-center top-4 sm:top-8 left-4 right-4 sm:left-8 sm:right-8 absolute no-print">
        <Link to="/" className="text-white/50 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
        </Link>
        <button 
          onClick={handleExportPdf}
          disabled={isExporting}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 rounded-lg transition-colors font-bold disabled:opacity-50 disabled:cursor-wait"
        >
          {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
          <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
          <span className="sm:hidden">{isExporting ? '...' : 'PDF'}</span>
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10 mt-16 pt-12">
        <h1 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary">Comprehensive Numerology</h1>
        <p className="text-xl text-white/60 max-w-3xl mx-auto mb-4">The deepest algorithmic permutations based on your exact Birth Date and Full Name.</p>
        <p className="text-sm font-bold text-primary animate-pulse bg-primary/10 inline-block px-4 py-2 rounded-full border border-primary/20">
          Tap any card for a deep dive and real-world examples!
        </p>
      </motion.div>

      <SectionHeading title="Core Pillars" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NumberCard onClick={setSelectedItem} title="Life Path Number" numberObj={data.core.lifePath} description="The core of your identity and the journey you are meant to take." delay={0.1}/>
        <NumberCard onClick={setSelectedItem} title="Destiny / Expression" numberObj={data.core.destiny} description="Your life's purpose and the talents you must utilize." delay={0.15}/>
        <NumberCard onClick={setSelectedItem} title="Soul Urge / Heart" numberObj={data.core.soulUrge} description="Your inner cravings, true motivations, and what you value most." delay={0.2}/>
        <NumberCard onClick={setSelectedItem} title="Personality Number" numberObj={data.core.personality} description="How others perceive you initially and your outer demeanor." delay={0.25}/>
        <NumberCard onClick={setSelectedItem} title="Maturity Number" numberObj={data.core.maturity} description="Your ultimate goal and where your life is heading in later years." delay={0.3}/>
        <NumberCard onClick={setSelectedItem} title="Birth Day Number" numberObj={data.core.birthDay} description="Your specific natural talents brought into this world." delay={0.35}/>
      </div>

      <SectionHeading title="Characteristics & Traits" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NumberCard onClick={setSelectedItem} title="Attitude" numberObj={data.characteristics.attitude} description="Your general disposition." delay={0.4}/>
        <NumberCard onClick={setSelectedItem} title="Balance" numberObj={data.characteristics.balance} description="How you handle difficult situations." delay={0.45}/>
        <NumberCard onClick={setSelectedItem} title="Hidden Passion" numberObj={data.characteristics.hiddenPassion} description="Talents you love doing." delay={0.5}/>
        <NumberCard onClick={setSelectedItem} title="Subconscious" numberObj={data.characteristics.subconsciousSelf} description="Your confidence level." delay={0.55}/>
        <NumberCard onClick={setSelectedItem} title="Rational Thought" numberObj={data.characteristics.rationalThought} description="How your mind works." delay={0.6}/>
      </div>

      <SectionHeading title="Exhaustive Permutations & Letters" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NumberCard onClick={setSelectedItem} title="Life Path - Destiny Bridge" numberObj={data.permutations.bridgeLifePathDestiny} description="How to bridge the gap between your purpose and your destiny." delay={0.1}/>
        <NumberCard onClick={setSelectedItem} title="Soul - Personality Bridge" numberObj={data.permutations.bridgeSoulPersonality} description="How to align your inner desires with your outer persona." delay={0.15}/>
        <NumberCard onClick={setSelectedItem} title="Cornerstone" numberObj={{ ...data.permutations.cornerstone, value: data.permutations.cornerstone.letter }} description="How you approach new beginnings." delay={0.2}/>
        <NumberCard onClick={setSelectedItem} title="Capstone" numberObj={{ ...data.permutations.capstone, value: data.permutations.capstone.letter }} description="How you finish what you start." delay={0.25}/>
        <NumberCard onClick={setSelectedItem} title="First Vowel" numberObj={{ ...data.permutations.firstVowel, value: data.permutations.firstVowel.letter }} description="Your first emotional response." delay={0.3}/>
      </div>
      
      <SectionHeading title="Planes of Expression" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NumberCard onClick={setSelectedItem} title="Physical Plane" numberObj={{ ...data.permutations.planes.physical, value: data.permutations.planes.physical.count }} description="Letters: D, E, M, N, V, W" delay={0.4}/>
        <NumberCard onClick={setSelectedItem} title="Mental Plane" numberObj={{ ...data.permutations.planes.mental, value: data.permutations.planes.mental.count }} description="Letters: A, H, J, Q, S, Z" delay={0.45}/>
        <NumberCard onClick={setSelectedItem} title="Emotional Plane" numberObj={{ ...data.permutations.planes.emotional, value: data.permutations.planes.emotional.count }} description="Letters: B, C, F, K, L, O, T, U, X" delay={0.5}/>
        <NumberCard onClick={setSelectedItem} title="Intuitive Plane" numberObj={{ ...data.permutations.planes.intuitive, value: data.permutations.planes.intuitive.count }} description="Letters: G, I, P, R, Y" delay={0.55}/>
      </div>

      <SectionHeading title="Birth Grid Frequencies" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.permutations.birthGrid?.length > 0 ? data.permutations.birthGrid.map((bg, index) => (
           <NumberCard 
            key={index} 
            onClick={setSelectedItem} 
            title={`Digit ${bg.digit} Frequency`} 
            numberObj={{ value: String(bg.digit).repeat(bg.count), reading: bg.reading, deepDetails: bg.deepDetails, example: bg.example }} 
            description={`You have ${bg.count} occurrences of the number ${bg.digit} in your birthdate.`} 
            delay={0.1 + (index * 0.05)}
          />
        )) : (
          <p className="text-white/50 col-span-3 text-center py-8">No specific repeating frequencies found in your birth grid.</p>
        )}
      </div>

      <SectionHeading title="Temporal Cycles & Forecasting" />
      <div className="grid grid-cols-1 gap-6 mb-6">
        <NumberCard onClick={setSelectedItem} title="Personal Year" numberObj={data.cycles.personalYear} description="The overall theme of your current year." delay={0.6}/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CycleCard onClick={setSelectedItem} title="Pinnacle Cycles" data={data.cycles.pinnacles} delay={0.65} />
        <CycleCard onClick={setSelectedItem} title="Challenge Cycles" data={data.cycles.challenges} delay={0.7} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ArrayCard title="Life Cycles" numbers={[data.cycles.lifeCycles.first.value, data.cycles.lifeCycles.second.value, data.cycles.lifeCycles.third.value]} description="Your three major life stages." delay={0.75} />
        <ArrayCard title="Personal Time" numbers={[data.cycles.personalYear.value, data.cycles.personalMonth.value, data.cycles.personalDay.value]} description="Current personal year, month, and day." delay={0.8} />
        <ArrayCard title="Universal Time" numbers={[data.cycles.universalYear.value, data.cycles.universalMonth.value, data.cycles.universalDay.value]} description="Current universal year, month, and day." delay={0.85} />
      </div>

      <SectionHeading title="Karmic Indicators" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ArrayCard 
          title="Karmic Debts" 
          numbers={data.karma.karmicDebts.map(k => k.value)} 
          description="Debts from past lives requiring specific work to overcome (13, 14, 16, 19). 'None' means you have paid them off." 
          delay={1.0}
        />
        <ArrayCard 
          title="Karmic Lessons" 
          numbers={data.karma.karmicLessons.map(k => k.value)} 
          description="Numbers missing from your name, representing weaknesses you are meant to work on in this life." 
          delay={1.1}
        />
      </div>
    </div>
  );
}
