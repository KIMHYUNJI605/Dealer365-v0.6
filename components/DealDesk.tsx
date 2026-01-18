import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  CreditCard, 
  Wallet, 
  Banknote, 
  TrendingUp, 
  Lock, 
  Unlock, 
  Car, 
  Check, 
  AlertCircle,
  ChevronDown,
  Info,
  DollarSign,
  Briefcase,
  ArrowLeft
} from 'lucide-react';
import { MOCK_CONFIGURABLE_MODELS, MOCK_FINANCE_RATES, MOCK_DEALS } from '../data/mockData';
import { useNavigation } from '../context/NavigationContext';

interface DealDeskProps {
    onBack?: () => void;
    dealId?: string;
}

const DealDesk: React.FC<DealDeskProps> = ({ onBack, dealId }) => {
    const { userRole, openTabs, activeTabId } = useNavigation();

    // --- Retrieve Data ---
    // 1. Try props (Hub mode)
    // 2. Try Tab context (Direct link mode)
    const activeTab = openTabs.find(t => t.id === activeTabId);
    const contextData = activeTab?.data || {};
    
    // Resolve which data source to use
    const resolvedDealId = dealId || contextData.dealId;
    const existingDeal = MOCK_DEALS.find(d => d.id === resolvedDealId);

    // If we have an existing deal, try to match it to a model
    // In a real app, the deal would have the modelId stored.
    // For mock, we map vehicle string to ID roughly
    let initialModelId = 'MOD-GV80';
    if (existingDeal) {
        if (existingDeal.vehicle.includes('911')) initialModelId = 'MOD-911';
        // Add other mappings if needed
    } else if (contextData.modelId) {
        initialModelId = contextData.modelId;
    }

    const resolvedModel = MOCK_CONFIGURABLE_MODELS.find(m => m.id === initialModelId) || MOCK_CONFIGURABLE_MODELS[0];
    
    // Resolve Configuration (Selections)
    // If coming from Configurator, we have selections. If from existing Deal, use defaults or mock saved selections.
    const initialSelections = contextData.selections || {
        engine: resolvedModel.configOptions.engines[0],
        transmission: resolvedModel.configOptions.transmissions[0],
        exterior: resolvedModel.configOptions.colors[1],
        interior: resolvedModel.configOptions.interiors[0],
        wheel: resolvedModel.configOptions.wheels[0],
        packages: []
    };

    // 3. Calculate Options Total Dynamically
    const calculateOptionsTotal = () => {
        let total = 0;
        if (initialSelections) {
            total += initialSelections.engine?.price || 0;
            total += initialSelections.transmission?.price || 0;
            total += initialSelections.exterior?.price || 0;
            total += initialSelections.interior?.price || 0;
            total += initialSelections.wheel?.price || 0;
            
            // Packages
            if (initialSelections.packages && initialSelections.packages.length > 0) {
                 const pkgIds = initialSelections.packages;
                 const pkgObjs = resolvedModel.configOptions.packages.filter(p => pkgIds.includes(p.id));
                 total += pkgObjs.reduce((acc: number, p: any) => acc + p.price, 0);
            }
        }
        return total;
    };

    const optionsTotalValue = useMemo(() => calculateOptionsTotal(), [initialSelections, resolvedModel]);

    // --- State ---
    const [vehicle, setVehicle] = useState(resolvedModel); 
    const [dealMode, setDealMode] = useState<'FINANCE' | 'LEASE' | 'CASH'>('FINANCE');
    const [creditTier, setCreditTier] = useState<string>(existingDeal?.tier === 'Gold' ? "650-699 (Non-Prime)" : "700-749 (Prime)");
    const [term, setTerm] = useState<number>(60);
    const [downPayment, setDownPayment] = useState<number>(existingDeal ? 5000 : 5000); // Mock logic
    const [tradeInValue, setTradeInValue] = useState<number>(0);
    const [tradeInPayoff, setTradeInPayoff] = useState<number>(0);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [managerMode, setManagerMode] = useState(false);

    // --- Calculations ---
    const calculateDeal = (customDown?: number, customTerm?: number) => {
        const activeTerm = customTerm || term;
        const activeDown = customDown !== undefined ? customDown : downPayment;

        // Base Numbers
        const msrp = vehicle.basePrice;
        const vehiclePrice = existingDeal ? existingDeal.price : (msrp + optionsTotalValue); // Use saved price if exists
        
        // Products
        const productsTotal = selectedProducts.reduce((acc, id) => {
            const prod = MOCK_FINANCE_RATES.products.find(p => p.id === id);
            return acc + (prod ? prod.price : 0);
        }, 0);

        // Trade-In
        const netTrade = tradeInValue - tradeInPayoff;
        
        // Fees & Taxes (Simplified)
        const docFee = 499;
        const taxRate = 0.07;
        const taxableAmount = vehiclePrice + productsTotal + docFee - Math.max(0, netTrade); // Trade credit often reduces tax
        const taxes = taxableAmount * taxRate;

        // Total Amount Financed
        const amountFinanced = vehiclePrice + productsTotal + docFee + taxes - activeDown - netTrade;

        // Rate
        const rate = (MOCK_FINANCE_RATES.creditTiers as any)[creditTier] || 5.9;
        const monthlyRate = rate / 100 / 12;

        // Monthly Payment (Amortization)
        let monthlyPayment = 0;
        if (dealMode === 'CASH') {
            monthlyPayment = 0;
        } else if (amountFinanced > 0) {
            monthlyPayment = (amountFinanced * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -activeTerm));
        }

        // Lease Logic (Highly simplified for demo)
        if (dealMode === 'LEASE') {
            const residual = 0.55; // 55%
            const residualValue = vehiclePrice * residual;
            const depreciation = (amountFinanced - residualValue) / activeTerm;
            const rentCharge = (amountFinanced + residualValue) * 0.0025; // Money Factor approx
            monthlyPayment = depreciation + rentCharge;
        }

        return {
            amountFinanced,
            monthlyPayment,
            rate,
            taxes,
            totalPrice: vehiclePrice + productsTotal
        };
    };

    const currentDeal = useMemo(() => calculateDeal(), [
        vehicle, dealMode, creditTier, term, downPayment, tradeInValue, tradeInPayoff, selectedProducts, optionsTotalValue, existingDeal
    ]);

    // Menu Selling Scenarios
    const scenarios = useMemo(() => {
        return [
            {
                label: 'Aggressive',
                desc: 'Higher Down, Lower Pmt',
                down: downPayment + 3000,
                term: term,
                deal: calculateDeal(downPayment + 3000, term)
            },
            {
                label: 'Balanced',
                desc: 'Standard Terms',
                down: downPayment,
                term: term,
                deal: currentDeal
            },
            {
                label: 'No Money Down',
                desc: 'Sign & Drive',
                down: 0,
                term: term,
                deal: calculateDeal(0, term)
            }
        ];
    }, [currentDeal, downPayment, term]);

    return (
        <div className="flex h-full bg-[#F3F4F6] overflow-hidden flex-col">
            
            {/* Nav Header (Only if onBack is provided) */}
            {onBack && (
                <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center shrink-0">
                    <button 
                        onClick={onBack}
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back to Hub
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-4"></div>
                    <span className="text-sm font-bold text-gray-900">
                        {existingDeal ? `Editing ${existingDeal.id} - ${existingDeal.customerName}` : 'New Deal Structure'}
                    </span>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* LEFT PANEL: Vehicle & Trade (20%) */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
                    {/* Vehicle Card */}
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vehicle of Interest</h3>
                        <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                            <img src={vehicle.assets.exterior[0]} alt={vehicle.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                                {vehicle.id}
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{vehicle.name}</h2>
                        <p className="text-sm text-gray-500 mb-4">{vehicle.tagline}</p>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">MSRP</span>
                                <span className="font-bold text-gray-900">${vehicle.basePrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Options</span>
                                <span className="font-bold text-gray-900">${optionsTotalValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-100 pt-2">
                                <span className="font-bold text-gray-700">Vehicle Total</span>
                                <span className="font-bold text-blue-600">${(vehicle.basePrice + optionsTotalValue).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Trade-In */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                            <Car size={14} className="mr-1" /> Trade-In
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Allowance</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input 
                                        type="number" 
                                        value={tradeInValue || ''}
                                        onChange={(e) => setTradeInValue(Number(e.target.value))}
                                        placeholder="0"
                                        className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Payoff</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input 
                                        type="number" 
                                        value={tradeInPayoff || ''}
                                        onChange={(e) => setTradeInPayoff(Number(e.target.value))}
                                        placeholder="0"
                                        className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xs pt-2">
                                <span className="font-bold text-gray-500">Net Trade</span>
                                <span className={`font-bold ${tradeInValue - tradeInPayoff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${(tradeInValue - tradeInPayoff).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER PANEL: Scenario Builder (55%) */}
                <div className="flex-1 flex flex-col min-w-0">
                    
                    {/* Header Toolbar */}
                    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center space-x-4">
                            <Briefcase className="text-blue-600" />
                            <h1 className="text-xl font-bold text-gray-900">Smart Deal Desk</h1>
                        </div>
                        
                        {/* Mode Switcher */}
                        <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
                            {['FINANCE', 'LEASE', 'CASH'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => setDealMode(m as any)}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                                        dealMode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto relative">
                        
                        {/* STICKY SUMMARY HERO BAR */}
                        <div className="sticky top-0 z-20 bg-[#111827] text-white px-8 py-4 shadow-lg border-b border-gray-800 flex justify-between items-center">
                            <div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                                    {dealMode === 'CASH' ? 'Total Due' : 'Est. Monthly Payment'}
                                </div>
                                <div className="text-4xl font-black tracking-tight text-[#3FE0C5]">
                                    {dealMode === 'CASH' 
                                        ? `$${currentDeal.amountFinanced.toLocaleString()}` 
                                        : `$${Math.round(currentDeal.monthlyPayment).toLocaleString()}`
                                    }
                                    {dealMode !== 'CASH' && <span className="text-sm font-medium text-gray-500 ml-1">/mo</span>}
                                </div>
                            </div>
                            
                            {/* Key Metrics */}
                            <div className="flex space-x-8">
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-500 font-bold uppercase">Term</div>
                                    <div className="text-xl font-bold">{term} <span className="text-sm text-gray-600 font-medium">mos</span></div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-500 font-bold uppercase">Rate</div>
                                    <div className="text-xl font-bold">{currentDeal.rate}% <span className="text-sm text-gray-600 font-medium">APR</span></div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-500 font-bold uppercase">Down</div>
                                    <div className="text-xl font-bold">${downPayment.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* 1. Main Sliders & Inputs */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                    {/* Down Payment Slider */}
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-bold text-gray-700">Down Payment</label>
                                            <span className="text-sm font-bold text-blue-600">${downPayment.toLocaleString()}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="20000" 
                                            step="500" 
                                            value={downPayment}
                                            onChange={(e) => setDownPayment(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium">
                                            <span>$0</span>
                                            <span>$10k</span>
                                            <span>$20k</span>
                                        </div>
                                    </div>

                                    {/* Term Slider */}
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-bold text-gray-700">Term (Months)</label>
                                            <span className="text-sm font-bold text-blue-600">{term} mo</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="24" 
                                            max="84" 
                                            step="12" 
                                            value={term}
                                            onChange={(e) => setTerm(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium">
                                            {MOCK_FINANCE_RATES.terms.map(t => <span key={t}>{t}</span>)}
                                        </div>
                                    </div>
                                </div>

                                {/* Credit Tier Dropdown */}
                                <div className="mb-2">
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Estimated Credit Tier</label>
                                    <div className="relative">
                                        <select 
                                            value={creditTier}
                                            onChange={(e) => setCreditTier(e.target.value)}
                                            className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {Object.keys(MOCK_FINANCE_RATES.creditTiers).map(tier => (
                                                <option key={tier} value={tier}>{tier}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Menu Selling Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {scenarios.map((scenario, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer group ${
                                            scenario.label === 'Balanced' 
                                            ? 'bg-blue-50 border-blue-200 shadow-md ring-1 ring-blue-100' 
                                            : 'bg-white border-gray-100 hover:border-blue-100 hover:shadow-md'
                                        }`}
                                        onClick={() => {
                                            setDownPayment(scenario.down);
                                            setTerm(scenario.term);
                                        }}
                                    >
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{scenario.label}</div>
                                        <div className="text-[10px] text-gray-500 mb-4">{scenario.desc}</div>
                                        
                                        <div className="flex items-baseline space-x-1 mb-2">
                                            <span className="text-3xl font-black text-gray-900">${Math.round(scenario.deal.monthlyPayment).toLocaleString()}</span>
                                            <span className="text-xs font-bold text-gray-500">/mo</span>
                                        </div>
                                        
                                        <div className="space-y-1 text-xs text-gray-600 border-t border-gray-200/50 pt-3">
                                            <div className="flex justify-between">
                                                <span>Down</span>
                                                <span className="font-bold">${scenario.down.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Term</span>
                                                <span className="font-bold">{scenario.term} mo</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>APR</span>
                                                <span className="font-bold">{scenario.deal.rate}%</span>
                                            </div>
                                        </div>

                                        {scenario.label === 'Balanced' && (
                                            <div className="absolute top-3 right-3 text-blue-600">
                                                <CheckCircleIcon size={20} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* 3. F&I Products */}
                            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                                <ShieldIcon className="mr-2 text-green-600" size={18} /> 
                                Protect Your Investment
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {MOCK_FINANCE_RATES.products.map(prod => {
                                    const isSelected = selectedProducts.includes(prod.id);
                                    return (
                                        <button
                                            key={prod.id}
                                            onClick={() => setSelectedProducts(prev => 
                                                isSelected ? prev.filter(id => id !== prod.id) : [...prev, prod.id]
                                            )}
                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                                                isSelected 
                                                ? 'bg-green-50 border-green-200 shadow-sm' 
                                                : 'bg-white border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div>
                                                <div className={`font-bold text-sm ${isSelected ? 'text-green-800' : 'text-gray-900'}`}>{prod.name}</div>
                                                <div className="text-xs text-gray-500 font-medium">{prod.type}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-bold text-sm ${isSelected ? 'text-green-700' : 'text-gray-700'}`}>${prod.price}</div>
                                                {isSelected && <Check size={14} className="ml-auto mt-1 text-green-600" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT PANEL: Profit Pilot (25%) */}
                <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
                    <div className="p-6 border-b border-gray-200 bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-gray-900 flex items-center">
                                <TrendingUp className="mr-2 text-indigo-600" /> Deal Analysis
                            </h2>
                            {userRole === 'MANAGER' && (
                                <button 
                                    onClick={() => setManagerMode(!managerMode)}
                                    className={`p-2 rounded-lg transition-colors ${managerMode ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'}`}
                                >
                                    {managerMode ? <Unlock size={18} /> : <Lock size={18} />}
                                </button>
                            )}
                        </div>

                        {/* Deal Score */}
                        <div className="flex items-center justify-center py-4 relative">
                            <DonutChart value={existingDeal ? existingDeal.probability : 82} size={120} strokeWidth={10} />
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-black text-gray-900">{existingDeal ? existingDeal.probability : 82}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Score</span>
                            </div>
                        </div>
                        <p className="text-center text-xs text-gray-500 font-medium">High Probability of Close</p>
                    </div>

                    <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                        {/* AI Suggestion */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full blur-xl -mr-8 -mt-8"></div>
                            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wide flex items-center mb-2">
                                <AlertCircle size={12} className="mr-1" /> AI Suggestion
                            </h4>
                            <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                                Extending the term to <span className="font-bold">72 months</span> could lower the payment by <span className="font-bold">$45/mo</span> while maintaining rate tier.
                            </p>
                            <button className="mt-3 text-xs font-bold text-indigo-600 bg-white px-3 py-1.5 rounded shadow-sm hover:bg-indigo-50 border border-indigo-100">
                                Apply Suggestion
                            </button>
                        </div>

                        {/* Manager Mode: Gross Profit */}
                        {managerMode ? (
                            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-gray-900 text-sm">Profitability</h4>
                                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Healthy</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Front Gross</span>
                                        <span className="font-bold text-gray-900">${existingDeal?.gross || 2450}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Back Gross (F&I)</span>
                                        <span className="font-bold text-gray-900">$1,890</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                                        <span className="font-bold text-gray-700">Total Gross</span>
                                        <span className="font-bold text-green-600">${(existingDeal?.gross || 2450) + 1890}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                <Lock size={24} className="text-gray-300 mb-2" />
                                <p className="text-xs text-gray-400 font-medium">Profit data hidden.<br/>Unlock Manager Mode to view.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Action */}
                    <div className="p-6 border-t border-gray-200 bg-white">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 flex items-center justify-center transition-all active:scale-95">
                            <Check size={20} className="mr-2" />
                            Finalize Quote
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Subcomponents ---

const DonutChart = ({ value, size, strokeWidth }: any) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    
    // Determine color based on score
    let color = 'text-green-500';
    if (value < 50) color = 'text-red-500';
    else if (value < 75) color = 'text-yellow-500';

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E5E7EB"
                strokeWidth={strokeWidth}
                fill="transparent"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className={`${color} transition-all duration-1000 ease-out`}
            />
        </svg>
    );
};

const CheckCircleIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const ShieldIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

export default DealDesk;