import React, { useState, useMemo } from 'react';
import { 
  Car, 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  X, 
  Maximize2, 
  Calculator, 
  CreditCard, 
  Calendar, 
  CheckCircle,
  BellRing,
  RotateCw,
  Palette,
  ChevronRight
} from 'lucide-react';
import { MOCK_INVENTORY } from '../data/mockData';

type ViewMode = 'GRID' | 'DETAIL';

const SalesShowroom: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const [selectedCar, setSelectedCar] = useState<typeof MOCK_INVENTORY[0] | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // --- Handlers ---

  const toggleCompare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      if (prev.length >= 2) return [prev[1], id]; // Keep max 2, replace oldest
      return [...prev, id];
    });
  };

  const openDetail = (car: typeof MOCK_INVENTORY[0]) => {
    setSelectedCar(car);
    setViewMode('DETAIL');
  };

  const handleTestDrive = () => {
    setNotification(`Test Drive request sent to Dashboard for ${selectedCar?.year} ${selectedCar?.model}!`);
    setTimeout(() => setNotification(null), 4000);
  };

  // --- Renderers ---

  if (viewMode === 'DETAIL' && selectedCar) {
    return (
      <ConfiguratorView 
        car={selectedCar} 
        onBack={() => {
          setViewMode('GRID');
          setSelectedCar(null);
        }}
        onTestDrive={handleTestDrive}
        notification={notification}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      
      {/* Filters / Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Car className="mr-2 text-blue-600" /> 
          Inventory 
          <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{MOCK_INVENTORY.length} Available</span>
        </h2>
        
        <div className="flex items-center space-x-3">
          {compareList.length > 0 && (
            <button 
              onClick={() => setShowCompareModal(true)}
              className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg animate-in fade-in slide-in-from-bottom-4"
            >
              Compare ({compareList.length})
            </button>
          )}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_INVENTORY.map(car => {
            const isSelected = compareList.includes(car.stockId);
            return (
              <div 
                key={car.stockId}
                onClick={() => openDetail(car)}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer relative"
              >
                {/* Image Area */}
                <div className="h-48 overflow-hidden relative">
                  <img src={car.image} alt={car.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-0 inset-x-0 p-3 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                    <span className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-gray-900">
                      {car.status}
                    </span>
                    <button 
                      onClick={(e) => toggleCompare(e, car.stockId)}
                      className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                    >
                      {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">{car.year} {car.make}</div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{car.model} {car.trim}</h3>
                  <div className="flex items-end justify-between mt-3">
                    <div className="text-xl font-bold text-blue-700">${car.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 font-medium">{car.daysInStock} days old</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Modal Overlay */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowCompareModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Vehicle Comparison</h3>
              <button onClick={() => setShowCompareModal(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-2 divide-x divide-gray-100 overflow-y-auto">
              {compareList.map(id => {
                const car = MOCK_INVENTORY.find(c => c.stockId === id);
                if (!car) return null;
                return (
                  <div key={id} className="px-6 flex flex-col items-center text-center space-y-4">
                    <img src={car.image} className="w-full h-48 object-cover rounded-lg shadow-sm" alt={car.model} />
                    <div>
                      <h4 className="text-xl font-bold">{car.year} {car.make} {car.model}</h4>
                      <p className="text-gray-500">{car.trim}</p>
                    </div>
                    <div className="w-full space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">Price</span>
                        <span className="font-bold text-blue-600">${car.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">Stock ID</span>
                        <span className="font-mono">{car.stockId}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">Availability</span>
                        <span className="font-bold text-green-600">{car.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {compareList.length < 2 && (
                <div className="flex items-center justify-center text-gray-400 p-10 bg-gray-50/50">
                  Select another vehicle to compare
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- CONFIGURATOR / DETAIL VIEW ---

const ConfiguratorView = ({ car, onBack, onTestDrive, notification }: any) => {
  // Deal Desk State
  const [downPayment, setDownPayment] = useState(10000);
  const [term, setTerm] = useState(60);
  const [creditScore, setCreditScore] = useState(720);

  // Calculation Logic
  const interestRate = creditScore > 750 ? 0.049 : creditScore > 650 ? 0.069 : 0.099;
  const loanAmount = car.price - downPayment;
  const monthlyRate = interestRate / 12;
  const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  
  // AI Deal Score Logic (Arbitrary for demo)
  // Higher score = Better chance of closing (e.g., affordable payment)
  const dealScore = Math.min(100, Math.max(10, 
    (downPayment / car.price * 300) + (creditScore / 10) - (monthlyPayment / 200)
  ));
  
  let scoreColor = 'bg-red-500';
  if (dealScore > 50) scoreColor = 'bg-yellow-500';
  if (dealScore > 75) scoreColor = 'bg-green-500';

  return (
    <div className="flex h-full bg-white relative overflow-hidden">
      
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-4">
           <BellRing size={20} className="text-yellow-400" />
           <span className="font-medium">{notification}</span>
        </div>
      )}

      {/* LEFT: 3D Visualizer Placeholder */}
      <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 relative flex flex-col">
        <div className="absolute top-4 left-4 z-10">
          <button onClick={onBack} className="bg-white/80 backdrop-blur p-2 rounded-full hover:bg-white transition shadow-sm border border-gray-200">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
        </div>

        {/* 3D Model Area */}
        <div className="flex-1 flex items-center justify-center relative perspective-1000">
          <div className="w-[80%] aspect-video bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000')] bg-contain bg-center bg-no-repeat drop-shadow-2xl transition-all duration-700 transform hover:scale-105">
             {/* This is where a Three.js canvas would go */}
          </div>
          
          {/* Visual Controls */}
          <div className="absolute bottom-8 flex space-x-4 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-white/50">
             <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600">
                <RotateCw size={20} />
                <span className="text-[10px] font-bold uppercase">Rotate</span>
             </button>
             <div className="w-px bg-gray-300 h-8"></div>
             <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600">
                <Palette size={20} />
                <span className="text-[10px] font-bold uppercase">Color</span>
             </button>
             <div className="w-px bg-gray-300 h-8"></div>
             <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600">
                <Maximize2 size={20} />
                <span className="text-[10px] font-bold uppercase">Inside</span>
             </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Smart Deal Desk */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{car.year} {car.make}</div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">{car.model}</h1>
          <p className="text-gray-500 font-medium">{car.trim}</p>
          <div className="mt-4 text-3xl font-bold text-blue-600">${car.price.toLocaleString()}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
           
           {/* Deal Parameters */}
           <div className="space-y-6">
              <h3 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wide">
                 <Calculator size={16} className="mr-2" /> Deal Structure
              </h3>
              
              <div>
                 <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Down Payment</span>
                    <span className="font-bold">${downPayment.toLocaleString()}</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" 
                    max={car.price * 0.5} 
                    step="500"
                    value={downPayment}
                    onChange={(e) => setDownPayment(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                 />
              </div>

              <div>
                 <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Term (Months)</span>
                    <span className="font-bold">{term} Mo</span>
                 </div>
                 <input 
                    type="range" 
                    min="24" 
                    max="84" 
                    step="12"
                    value={term}
                    onChange={(e) => setTerm(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                 />
              </div>

              <div>
                 <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Credit Score Est.</span>
                    <span className="font-bold">{creditScore}</span>
                 </div>
                 <div className="flex space-x-2">
                    {[620, 700, 780].map(s => (
                       <button 
                          key={s}
                          onClick={() => setCreditScore(s)}
                          className={`flex-1 py-1 text-xs font-bold rounded border ${creditScore === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}
                       >
                          {s === 780 ? 'Excellent' : s === 700 ? 'Good' : 'Fair'}
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Monthly Payment Result */}
           <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
              <div className="text-xs font-bold text-gray-400 uppercase mb-1">Estimated Monthly</div>
              <div className="text-4xl font-black text-gray-900">${Math.round(monthlyPayment).toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">@{ (interestRate * 100).toFixed(2) }% APR</div>
           </div>

           {/* AI Deal Score */}
           <div>
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold uppercase text-gray-500">AI Deal Score</span>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${scoreColor}`}>
                    {dealScore > 75 ? 'Likely to Close' : 'Needs Adjustment'}
                 </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                 <div 
                   className={`h-full ${scoreColor} transition-all duration-500`} 
                   style={{ width: `${dealScore}%` }}
                 ></div>
              </div>
           </div>

        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
           <button 
             onClick={onTestDrive}
             className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
           >
              <Calendar size={18} />
              <span>Schedule Test Drive</span>
           </button>
           <button className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all">
              <CreditCard size={18} />
              <span>Send Credit App</span>
           </button>
        </div>

      </div>

    </div>
  );
};

export default SalesShowroom;
