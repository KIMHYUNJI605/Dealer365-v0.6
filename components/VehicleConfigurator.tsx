import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCw, 
  Maximize2, 
  Minimize2,
  Check, 
  Zap,
  Disc,
  Circle,
  Armchair,
  Package,
  Cpu,
  ShoppingBag,
  ArrowRight,
  Eye,
  Box,
  Car,
  Calculator
} from 'lucide-react';
import { MOCK_CONFIGURABLE_MODELS } from '../data/mockData';
import { useNavigation } from '../context/NavigationContext';
import { ViewType } from '../types';

// --- Types ---
type ConfigCategory = 'ENGINE' | 'TRANSMISSION' | 'EXTERIOR' | 'INTERIOR' | 'WHEEL' | 'OPTION';

interface VehicleConfiguratorProps {
    modelId: string;
    onBack: () => void;
}

const VehicleConfigurator: React.FC<VehicleConfiguratorProps> = ({ modelId, onBack }) => {
    // 0. Context for Navigation
    const { openTab } = useNavigation();

    // 1. Data Loading
    const model = MOCK_CONFIGURABLE_MODELS.find(m => m.id === modelId) || MOCK_CONFIGURABLE_MODELS[0];
    const opts = model.configOptions;

    // 2. State Management
    const [activeCategory, setActiveCategory] = useState<ConfigCategory>('EXTERIOR');
    const [viewMode, setViewMode] = useState<'EXT' | 'INT'>('EXT');
    const [currentAngleIndex, setCurrentAngleIndex] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Selections State
    const [selections, setSelections] = useState({
        engine: opts.engines[0],
        transmission: opts.transmissions[0],
        exterior: opts.colors[1],
        interior: opts.interiors[0],
        wheel: opts.wheels[0],
        packages: [] as string[] // Array of IDs
    });

    // 3. Derived State (Price Calculation)
    const activePackages = opts.packages.filter(p => selections.packages.includes(p.id));
    const totalPrice = 
        model.basePrice + 
        selections.engine.price + 
        selections.transmission.price + 
        selections.exterior.price + 
        selections.interior.price + 
        selections.wheel.price + 
        activePackages.reduce((acc, p) => acc + p.price, 0);

    // 4. Handlers
    const handleCategoryChange = (cat: ConfigCategory) => {
        setActiveCategory(cat);
        // Auto-switch view mode based on category
        if (cat === 'INTERIOR') setViewMode('INT');
        if (cat === 'EXTERIOR' || cat === 'WHEEL') setViewMode('EXT');
    };

    const togglePackage = (pkgId: string) => {
        setSelections(prev => {
            const exists = prev.packages.includes(pkgId);
            return {
                ...prev,
                packages: exists 
                    ? prev.packages.filter(id => id !== pkgId) 
                    : [...prev.packages, pkgId]
            };
        });
    };

    // Rotate Handler
    const handleRotate = () => {
        const assets = viewMode === 'EXT' ? model.assets.exterior : model.assets.interior;
        setCurrentAngleIndex((prev) => (prev + 1) % assets.length);
    };

    const handleFinish = () => {
        // Create a unique ID for this new deal
        const quoteId = `QUOTE-${Date.now().toString().slice(-6)}`;
        
        openTab({
            id: quoteId,
            type: ViewType.DEAL_EDITOR,
            title: `Deal: ${model.name}`,
            icon: Calculator,
            data: {
                modelId: model.id,
                selections: selections,
                totalPrice: totalPrice,
                source: 'Configurator'
            },
            isClosable: true
        });
    };

    const currentImage = viewMode === 'EXT' 
        ? model.assets.exterior[currentAngleIndex % model.assets.exterior.length]
        : model.assets.interior[currentAngleIndex % model.assets.interior.length];


    return (
        <div className="fixed inset-0 z-[100] bg-black text-white overflow-hidden font-sans selection:bg-[#3FE0C5] selection:text-black">
            
            {/* =================================================================================
                LAYER 1: IMMERSIVE BACKGROUND & VEHICLE
                Changed: Merged into a single full-screen layer using object-cover to eliminate black bars.
               ================================================================================= */}
            <div className="absolute inset-0 z-0">
                {/* Main Vehicle Image acting as Full Environment */}
                <div className="absolute inset-0 bg-[#111]">
                     <img 
                        key={`${viewMode}-${currentAngleIndex}`}
                        src={currentImage} 
                        alt="Vehicle" 
                        className={`
                            w-full h-full object-cover object-center transition-transform duration-1000 ease-out
                            ${isFullscreen ? 'scale-110' : 'scale-105'}
                        `}
                        draggable={false}
                    />
                </div>

                {/* Cinematic Overlays (Gradients & Atmospherics) */}
                
                {/* 1. Base Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />
                
                {/* 2. Color Tint (Neo Mint Ambient) */}
                <div className="absolute inset-0 bg-[#3FE0C5]/10 mix-blend-overlay pointer-events-none" />

                {/* 3. Bottom Gradient for UI Legibility */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
            </div>

            {/* =================================================================================
                LAYER 2: UI OVERLAYS (Header)
               ================================================================================= */}
            <div className={`absolute top-0 left-0 right-0 p-8 z-20 flex justify-between items-start pointer-events-none transition-opacity duration-500 ${isFullscreen ? 'opacity-0' : 'opacity-100'}`}>
                {/* Back Button */}
                <button 
                    onClick={onBack}
                    className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 pointer-events-auto hover:bg-black/60"
                >
                    <ArrowLeft size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Back</span>
                </button>

                {/* Header Info */}
                <div className="text-right pointer-events-auto">
                    <h1 className="text-5xl font-black italic tracking-tighter text-white drop-shadow-2xl">{model.name}</h1>
                    <div className="flex items-center justify-end space-x-3 mt-2">
                        <span className="text-xs font-bold text-white/60 uppercase tracking-widest bg-black/30 px-2 py-1 rounded backdrop-blur-sm">{model.tagline}</span>
                        <div className="h-4 w-px bg-white/20"></div>
                        <span className="text-2xl font-bold text-[#3FE0C5] drop-shadow-lg">${totalPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Right Side Actions - Always Visible */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-4 pointer-events-auto">
                {/* Expand / Collapse Button */}
                <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-[#3FE0C5] hover:text-[#3FE0C5] transition-all shadow-xl"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>

                {/* View Mode Toggle */}
                <button 
                    onClick={() => setViewMode(prev => prev === 'EXT' ? 'INT' : 'EXT')}
                    className="p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-[#3FE0C5] hover:text-[#3FE0C5] transition-all flex flex-col items-center justify-center space-y-1 shadow-xl"
                    title="Toggle Interior/Exterior"
                >
                    {viewMode === 'EXT' ? <Car size={20} /> : <Armchair size={20} />}
                    <span className="text-[9px] font-bold uppercase">{viewMode === 'EXT' ? 'EXT' : 'INT'}</span>
                </button>

                {/* Rotate Button */}
                <button 
                    onClick={handleRotate}
                    className="p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-[#3FE0C5] hover:text-[#3FE0C5] transition-all group shadow-xl"
                    title="Rotate Vehicle"
                >
                    <RotateCw size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
            </div>

            {/* =================================================================================
                LAYER 3: INTERACTION ZONE (Dock & Grid)
               ================================================================================= */}
            <div className={`absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center justify-end px-6 transition-transform duration-500 ease-in-out ${isFullscreen ? 'translate-y-[150%]' : 'translate-y-0'}`}>
                
                {/* 1. THE STAGE (Grid Options) - Floats above Dock */}
                <div className="mb-4 w-full max-w-5xl">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                        
                        {/* Grid Render Logic */}
                        <div className={`grid gap-3 ${activeCategory === 'EXTERIOR' || activeCategory === 'INTERIOR' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                            
                            {/* ENGINE */}
                            {activeCategory === 'ENGINE' && opts.engines.map(item => (
                                <TechCard 
                                    key={item.id} 
                                    title={item.name} 
                                    price={item.price} 
                                    specs={item.specs}
                                    selected={selections.engine.id === item.id}
                                    onClick={() => setSelections({...selections, engine: item})}
                                />
                            ))}

                            {/* TRANSMISSION */}
                            {activeCategory === 'TRANSMISSION' && opts.transmissions.map(item => (
                                <TechCard 
                                    key={item.id} 
                                    title={item.name} 
                                    price={item.price} 
                                    specs={item.specs}
                                    selected={selections.transmission.id === item.id}
                                    onClick={() => setSelections({...selections, transmission: item})}
                                />
                            ))}

                            {/* EXTERIOR COLORS */}
                            {activeCategory === 'EXTERIOR' && opts.colors.map(item => (
                                <SwatchCard 
                                    key={item.id} 
                                    name={item.name} 
                                    price={item.price} 
                                    hex={item.hex}
                                    selected={selections.exterior.id === item.id}
                                    onClick={() => setSelections({...selections, exterior: item})}
                                />
                            ))}

                            {/* INTERIOR */}
                            {activeCategory === 'INTERIOR' && opts.interiors.map(item => (
                                <SwatchCard 
                                    key={item.id} 
                                    name={item.name} 
                                    price={item.price} 
                                    hex={item.hex}
                                    subtext={item.material}
                                    selected={selections.interior.id === item.id}
                                    onClick={() => setSelections({...selections, interior: item})}
                                />
                            ))}

                            {/* WHEELS */}
                            {activeCategory === 'WHEEL' && opts.wheels.map(item => (
                                <ImageOptionCard 
                                    key={item.id}
                                    name={item.name} 
                                    price={item.price}
                                    image={item.image}
                                    selected={selections.wheel.id === item.id}
                                    onClick={() => setSelections({...selections, wheel: item})}
                                />
                            ))}

                            {/* PACKAGES */}
                            {activeCategory === 'OPTION' && opts.packages.map(item => (
                                <TechCard 
                                    key={item.id} 
                                    title={item.name} 
                                    price={item.price} 
                                    specs={item.features}
                                    selected={selections.packages.includes(item.id)}
                                    onClick={() => togglePackage(item.id)}
                                    multiSelect
                                />
                            ))}

                        </div>
                    </div>
                </div>

                {/* 2. THE DOCK (Tab Navigation) */}
                <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-2xl border border-white/10 p-2 rounded-full shadow-2xl overflow-x-auto max-w-full">
                    <DockItem label="Engine" icon={Zap} active={activeCategory === 'ENGINE'} onClick={() => handleCategoryChange('ENGINE')} />
                    <DockItem label="Trans" icon={Cpu} active={activeCategory === 'TRANSMISSION'} onClick={() => handleCategoryChange('TRANSMISSION')} />
                    <div className="w-px h-6 bg-white/10 mx-1 shrink-0"></div>
                    <DockItem label="Paint" icon={Circle} active={activeCategory === 'EXTERIOR'} onClick={() => handleCategoryChange('EXTERIOR')} />
                    <DockItem label="Interior" icon={Armchair} active={activeCategory === 'INTERIOR'} onClick={() => handleCategoryChange('INTERIOR')} />
                    <DockItem label="Wheels" icon={Disc} active={activeCategory === 'WHEEL'} onClick={() => handleCategoryChange('WHEEL')} />
                    <div className="w-px h-6 bg-white/10 mx-1 shrink-0"></div>
                    <DockItem label="Option" icon={Package} active={activeCategory === 'OPTION'} onClick={() => handleCategoryChange('OPTION')} />
                    
                    {/* Finish Action */}
                    <button 
                        onClick={handleFinish}
                        className="ml-2 px-6 py-3 bg-[#3FE0C5] text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center shrink-0 shadow-[0_0_15px_#3FE0C540]"
                    >
                        <span>Finish</span>
                        <ArrowRight size={14} className="ml-2" />
                    </button>
                </div>
            </div>

        </div>
    );
};

// ============================================================================
// SUB-COMPONENTS (Cards & Buttons)
// ============================================================================

const DockItem = ({ label, icon: Icon, active, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`
            flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-300 shrink-0
            ${active 
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105 font-bold' 
                : 'text-white/60 hover:text-white hover:bg-white/10'}
        `}
    >
        <Icon size={16} />
        <span className="text-xs uppercase tracking-wider">{label}</span>
    </button>
);

const TechCard = ({ title, price, specs, selected, onClick, multiSelect }: any) => (
    <button 
        onClick={onClick}
        className={`
            relative p-3 rounded-lg border text-left transition-all group overflow-hidden
            ${selected 
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30'}
        `}
    >
        <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-xs uppercase tracking-wide truncate pr-2">{title}</h3>
            {selected && <Check size={14} className={multiSelect ? "text-black" : "text-black"} />}
        </div>
        <p className={`text-[10px] mb-2 truncate ${selected ? 'text-black/60' : 'text-gray-500'}`}>{specs}</p>
        <div className={`text-[10px] font-bold ${selected ? 'text-black' : 'text-[#3FE0C5]'}`}>
            {price === 0 ? 'Included' : `+$${price.toLocaleString()}`}
        </div>
    </button>
);

const SwatchCard = ({ name, price, hex, subtext, selected, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`
            p-2 rounded-lg border flex items-center space-x-3 text-left transition-all group
            ${selected 
                ? 'bg-white/10 border-[#3FE0C5] ring-1 ring-[#3FE0C5]' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'}
        `}
    >
        <div 
            className={`w-9 h-9 rounded-full shadow-lg border-2 shrink-0 ${selected ? 'border-white scale-110' : 'border-white/20'}`} 
            style={{ backgroundColor: hex }}
        ></div>
        <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{name}</div>
            {subtext && <div className="text-[9px] text-gray-400 truncate">{subtext}</div>}
            <div className={`text-[9px] font-bold mt-0.5 ${selected ? 'text-[#3FE0C5]' : 'text-gray-500'}`}>
                {price === 0 ? 'Standard' : `+$${price}`}
            </div>
        </div>
    </button>
);

const ImageOptionCard = ({ name, price, image, selected, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`
            relative p-2 rounded-lg border text-left transition-all group overflow-hidden flex items-center space-x-3
            ${selected 
                ? 'bg-white/10 border-[#3FE0C5] ring-1 ring-[#3FE0C5]' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'}
        `}
    >
        <div className="w-12 h-12 rounded-md overflow-hidden bg-black shrink-0">
            <img src={image} alt={name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="min-w-0">
            <h3 className="font-bold text-xs text-white mb-0.5 truncate">{name}</h3>
            <div className={`text-[10px] font-bold ${selected ? 'text-[#3FE0C5]' : 'text-gray-500'}`}>
                {price === 0 ? 'Standard' : `+$${price.toLocaleString()}`}
            </div>
        </div>
    </button>
);

export default VehicleConfigurator;