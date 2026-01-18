import React, { useState } from 'react';
import { 
  Car, 
  CheckSquare, 
  Square, 
  X,
  PlayCircle,
  Palette
} from 'lucide-react';
import { MOCK_CONFIGURABLE_MODELS } from '../data/mockData';
import VehicleConfigurator from './VehicleConfigurator';

const SalesShowroom: React.FC = () => {
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // --- Handlers ---
  const toggleCompare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      if (prev.length >= 2) return [prev[1], id]; // Keep max 2
      return [...prev, id];
    });
  };

  if (activeConfigId) {
    return (
        <VehicleConfigurator 
            modelId={activeConfigId} 
            onBack={() => setActiveConfigId(null)} 
        />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20 shadow-sm">
        <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Car className="mr-2 text-blue-600" /> 
            Digital Showroom
            </h2>
            <p className="text-xs text-gray-500">Select a model to configure or compare specifications.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {compareList.length > 0 && (
            <button 
              onClick={() => setShowCompareModal(true)}
              className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg animate-in fade-in"
            >
              Compare ({compareList.length})
            </button>
          )}
        </div>
      </div>

      {/* Models Grid */}
      <div className="p-8 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {MOCK_CONFIGURABLE_MODELS.map(model => {
            const isSelected = compareList.includes(model.id);
            return (
              <div 
                key={model.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-[500px]"
              >
                {/* Image Area */}
                <div className="h-[60%] overflow-hidden relative bg-gray-100">
                  <img src={model.assets.exterior[1]} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  
                  <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 uppercase tracking-wide">
                      {model.year} Model
                    </span>
                    <button 
                      onClick={(e) => toggleCompare(e, model.id)}
                      className={`p-2 rounded-full transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-black/30 text-white hover:bg-black/50 backdrop-blur-md'}`}
                    >
                      {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                      <button 
                        onClick={() => setActiveConfigId(model.id)}
                        className="bg-white text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl flex items-center"
                      >
                          <PlayCircle size={18} className="mr-2" />
                          Launch Configurator
                      </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between relative bg-white">
                    <div className="absolute -top-6 right-6 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10 font-serif font-bold text-xl italic">
                        i
                    </div>
                    
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-1">{model.name}</h3>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">{model.tagline}</p>
                        
                        <div className="mt-6 flex space-x-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 uppercase font-bold">Base MSRP</span>
                                <span className="text-lg font-bold text-gray-900">${model.basePrice.toLocaleString()}</span>
                            </div>
                            <div className="w-px bg-gray-100 h-full"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 uppercase font-bold">Trims</span>
                                <span className="text-lg font-bold text-gray-900">{model.trims.length} Options</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                         <div className="flex -space-x-2">
                             {model.colors.slice(0,4).map(c => (
                                 <div key={c.id} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c.hex }}></div>
                             ))}
                             <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                                 +
                             </div>
                         </div>
                         <button 
                            onClick={() => setActiveConfigId(model.id)}
                            className="text-blue-600 font-bold text-sm hover:underline flex items-center"
                        >
                             <Palette size={16} className="mr-2" /> Build Your Own
                         </button>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Modal Overlay */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowCompareModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Spec Comparison</h3>
              <button onClick={() => setShowCompareModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-2 gap-12">
                {compareList.map(id => {
                    const model = MOCK_CONFIGURABLE_MODELS.find(m => m.id === id);
                    if (!model) return null;
                    return (
                    <div key={id} className="flex flex-col text-center space-y-6">
                        <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                            <img src={model.assets.exterior[0]} className="w-full h-full object-cover" alt={model.name} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-gray-900">{model.name}</h4>
                            <p className="text-gray-500 font-medium uppercase tracking-widest text-xs mt-1">{model.tagline}</p>
                        </div>
                        
                        <div className="space-y-4 text-left bg-gray-50 p-6 rounded-xl border border-gray-100">
                             <div className="flex justify-between border-b border-gray-200 pb-3">
                                 <span className="text-gray-500 text-sm">Starting MSRP</span>
                                 <span className="font-bold text-gray-900">${model.basePrice.toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between border-b border-gray-200 pb-3">
                                 <span className="text-gray-500 text-sm">Standard HP</span>
                                 <span className="font-bold text-gray-900">{model.trims[0].features[0]}</span>
                             </div>
                             <div className="flex justify-between border-b border-gray-200 pb-3">
                                 <span className="text-gray-500 text-sm">Colors</span>
                                 <span className="font-bold text-gray-900">{model.colors.length} Available</span>
                             </div>
                             <div className="pt-2">
                                 <button 
                                    onClick={() => { setActiveConfigId(model.id); setShowCompareModal(false); }}
                                    className="w-full bg-black text-white py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
                                >
                                     Configure This Model
                                 </button>
                             </div>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesShowroom;