import React, { useState } from 'react';
import { 
  Clock, 
  Mic, 
  Pause, 
  Play, 
  CheckCircle, 
  MapPin, 
  AlertTriangle, 
  ChevronUp,
  Camera,
  MessageSquare,
  ClipboardCheck,
  X,
  Check,
  AlertOctagon,
  ChevronDown
} from 'lucide-react';
import { MOCK_ROS, MOCK_TECHS } from '../data/mockData';

// Simulating logged-in tech "Alex Smith"
const CURRENT_TECH = MOCK_TECHS[0];

// --- Types & Data for Inspection ---
type InspectionStatus = 'pass' | 'warn' | 'fail' | null;

interface InspectionPoint {
  id: string;
  label: string;
}

interface InspectionCategory {
  id: string;
  title: string;
  items: InspectionPoint[];
}

const MPI_DATA: InspectionCategory[] = [
  {
    id: 'cat-tires',
    title: 'Tires & Brakes',
    items: [
      { id: 't-fl', label: 'Front Left Tire Tread' },
      { id: 't-fr', label: 'Front Right Tire Tread' },
      { id: 't-rl', label: 'Rear Left Tire Tread' },
      { id: 't-rr', label: 'Rear Right Tire Tread' },
      { id: 'b-pads', label: 'Brake Pad Thickness' },
    ]
  },
  {
    id: 'cat-hood',
    title: 'Under Hood',
    items: [
      { id: 'f-oil', label: 'Engine Oil Level' },
      { id: 'f-coolant', label: 'Coolant Level' },
      { id: 'f-brake', label: 'Brake Fluid Condition' },
      { id: 'b-battery', label: 'Battery Health' },
    ]
  },
  {
    id: 'cat-ext',
    title: 'Exterior & Interior',
    items: [
      { id: 'e-wipers', label: 'Wiper Blades' },
      { id: 'e-lights', label: 'Lights & Signals' },
      { id: 'i-horn', label: 'Horn Operation' },
    ]
  }
];

const TechnicianView: React.FC = () => {
  // Find jobs assigned to this tech
  const myJobs = MOCK_ROS.filter(ro => ro.technician === CURRENT_TECH.name);
  const activeJob = myJobs.find(ro => ro.status === 'Working');
  const queuedJobs = myJobs.filter(ro => ro.status !== 'Working' && ro.status !== 'Closed');
  
  // Mock Paused Job for the stack
  const pausedJobCount = 1;

  // Inspection State
  const [showInspection, setShowInspection] = useState(false);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white overflow-hidden relative font-sans">
      
      {/* 1. Header Section */}
      <div className="p-6 bg-gray-800 border-b border-gray-700 shadow-md z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Welcome Back</h2>
            <h1 className="text-3xl font-bold tracking-tight text-white">{CURRENT_TECH.name}</h1>
            <div className="flex items-center mt-2 text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
              <span className="text-sm font-bold uppercase tracking-wider">Online • Shop A</span>
            </div>
          </div>
          
          {/* Efficiency Gauge */}
          <EfficiencyGauge value={CURRENT_TECH.efficiency} />
        </div>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        
        {/* ACTIVE JOB CARD */}
        {activeJob ? (
          <div className="bg-gray-800 rounded-2xl border-l-8 border-l-green-500 shadow-lg overflow-hidden ring-1 ring-white/10">
            <div className="bg-green-500/10 p-4 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="bg-green-500 text-black font-black text-xs px-2 py-1 rounded">IN PROGRESS</div>
                <span className="text-green-400 font-mono text-sm">01:42:15</span>
              </div>
              <MapPin size={18} className="text-gray-400" />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-4xl font-black text-white mb-2 tracking-tight">{activeJob.id}</h3>
                  <div className="text-xl text-gray-300 font-medium">{activeJob.vehicle}</div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-4 mb-6 border border-white/5">
                <p className="text-gray-300 text-lg leading-snug">
                  <span className="text-gray-500 font-bold uppercase text-xs block mb-1">Customer Concern</span>
                  "{activeJob.concern}"
                </p>
              </div>

              {/* Action Grid */}
              <div className="space-y-4">
                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="h-16 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center space-x-2 border border-gray-600 active:scale-95 transition-transform">
                    <Pause size={24} className="text-yellow-400" />
                    <span className="text-lg font-bold text-gray-200">Pause</span>
                    </button>
                    <button className="h-16 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/50 active:scale-95 transition-transform">
                    <CheckCircle size={24} className="text-white" />
                    <span className="text-lg font-bold text-white">Complete</span>
                    </button>
                </div>

                {/* Secondary Actions - Now includes MPI */}
                <button 
                    onClick={() => setShowInspection(true)}
                    className="w-full h-14 bg-gradient-to-r from-purple-900 to-purple-800 hover:from-purple-800 hover:to-purple-700 border border-purple-500/30 rounded-xl flex items-center justify-center space-x-3 shadow-lg active:scale-95 transition-all"
                >
                    <ClipboardCheck size={24} className="text-purple-300" />
                    <span className="text-lg font-bold text-white">Perform Inspection (MPI)</span>
                </button>

                <div className="grid grid-cols-2 gap-4">
                    <button className="h-12 bg-gray-900/50 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border border-gray-700 active:bg-gray-800">
                        <Camera size={20} className="mr-2" /> Add Media
                    </button>
                    <button className="h-12 bg-gray-900/50 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border border-gray-700 active:bg-gray-800">
                        <MessageSquare size={20} className="mr-2" /> Advisor Chat
                    </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl p-8 text-center border border-gray-700 border-dashed">
            <Clock size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-300">No Active Job</h3>
            <p className="text-gray-500">Select a job from the queue below to start.</p>
          </div>
        )}

        {/* UP NEXT QUEUE */}
        <div>
          <h3 className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4 pl-1">Up Next ({queuedJobs.length})</h3>
          <div className="space-y-4">
            {queuedJobs.map(ro => (
              <div key={ro.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-sm relative group active:bg-gray-750">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-gray-700 text-gray-300 text-xs font-bold px-2 py-1 rounded">{ro.status}</span>
                  <div className="text-gray-500 text-sm font-mono flex items-center">
                     <Clock size={14} className="mr-1" />
                     {new Date(ro.promiseTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                   <div>
                       <div className="text-2xl font-bold text-white mb-1">{ro.id}</div>
                       <div className="text-gray-400 font-medium">{ro.vehicle}</div>
                   </div>
                   <button className="bg-green-600 h-12 w-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                      <Play size={24} fill="currentColor" className="text-white ml-1" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Floating Action Bar / Stack */}
      <div className="absolute bottom-6 left-4 right-4 z-20">
        <div className="bg-gray-800/90 backdrop-blur-md border border-gray-700 p-2 rounded-2xl shadow-2xl flex items-center justify-between pl-4 pr-2">
           {/* Paused Stack */}
           <div className="flex items-center space-x-3 cursor-pointer">
              <div className="bg-yellow-600/20 text-yellow-500 p-2 rounded-lg border border-yellow-500/30">
                 <Pause size={20} />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs text-gray-400 font-bold uppercase">Paused</span>
                 <span className="text-sm font-bold text-white">{pausedJobCount} Job Waiting</span>
              </div>
              <ChevronUp size={16} className="text-gray-500" />
           </div>

           {/* Voice Note FAB */}
           <button className="h-14 w-14 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50 active:scale-95 transition-transform border border-red-400">
              <Mic size={28} className="text-white" />
           </button>
        </div>
      </div>

      {/* INSPECTION MODAL */}
      {showInspection && (
        <InspectionModal onClose={() => setShowInspection(false)} />
      )}

    </div>
  );
};

// --- Subcomponent: Inspection Modal ---

const InspectionModal = ({ onClose }: { onClose: () => void }) => {
    // State to track status of each item: { 't-fl': 'pass', 't-fr': 'fail' }
    const [statusMap, setStatusMap] = useState<Record<string, InspectionStatus>>({});
    const [expandedCat, setExpandedCat] = useState<string | null>(MPI_DATA[0].id);

    const toggleStatus = (itemId: string, status: InspectionStatus) => {
        setStatusMap(prev => ({
            ...prev,
            [itemId]: prev[itemId] === status ? null : status
        }));
    };

    const totalItems = MPI_DATA.reduce((acc, cat) => acc + cat.items.length, 0);
    const completedItems = Object.keys(statusMap).length;
    const progress = Math.round((completedItems / totalItems) * 100);

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col animate-in slide-in-from-bottom-full duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-white">Multi-Point Inspection</h2>
                    <div className="text-xs text-gray-400 font-mono mt-1">RO-24-1045 • {progress}% Complete</div>
                </div>
                <button onClick={onClose} className="p-2 bg-gray-700 rounded-full text-white hover:bg-gray-600">
                    <X size={24} />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-800 w-full shrink-0">
                <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
                {MPI_DATA.map(cat => {
                    const isExpanded = expandedCat === cat.id;
                    return (
                        <div key={cat.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                            <button 
                                onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                                className="w-full flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700/50 active:bg-gray-750"
                            >
                                <span className="font-bold text-gray-300 uppercase tracking-wider text-sm">{cat.title}</span>
                                {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                            </button>
                            
                            {isExpanded && (
                                <div className="divide-y divide-gray-700/50">
                                    {cat.items.map(item => {
                                        const currentStatus = statusMap[item.id];
                                        return (
                                            <div key={item.id} className="p-4">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-lg font-medium text-white">{item.label}</span>
                                                    <button className="text-gray-500 p-2 hover:bg-gray-700 rounded-full">
                                                        <Camera size={20} />
                                                    </button>
                                                </div>
                                                
                                                {/* Status Toggles - Huge targets */}
                                                <div className="grid grid-cols-3 gap-3 h-14">
                                                    <button 
                                                        onClick={() => toggleStatus(item.id, 'pass')}
                                                        className={`rounded-lg flex items-center justify-center border transition-all ${
                                                            currentStatus === 'pass' 
                                                            ? 'bg-green-600 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                                                            : 'bg-gray-700/50 border-gray-600 text-gray-500 hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        <Check size={28} />
                                                    </button>
                                                    <button 
                                                        onClick={() => toggleStatus(item.id, 'warn')}
                                                        className={`rounded-lg flex items-center justify-center border transition-all ${
                                                            currentStatus === 'warn' 
                                                            ? 'bg-yellow-600 border-yellow-400 text-white shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                                                            : 'bg-gray-700/50 border-gray-600 text-gray-500 hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        <AlertTriangle size={28} />
                                                    </button>
                                                    <button 
                                                        onClick={() => toggleStatus(item.id, 'fail')}
                                                        className={`rounded-lg flex items-center justify-center border transition-all ${
                                                            currentStatus === 'fail' 
                                                            ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                                                            : 'bg-gray-700/50 border-gray-600 text-gray-500 hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        <AlertOctagon size={28} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer Submit */}
            <div className="p-4 bg-gray-800 border-t border-gray-700 shrink-0 safe-area-bottom">
                <button 
                    onClick={onClose}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-14 rounded-xl text-lg shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                >
                    <ClipboardCheck size={20} />
                    <span>Submit Inspection</span>
                </button>
            </div>
        </div>
    );
};

// --- Subcomponent: Efficiency Gauge ---
const EfficiencyGauge = ({ value }: { value: number }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  // Color logic
  let strokeColor = "text-blue-500";
  if (value > 100) strokeColor = "text-green-400";
  if (value < 90) strokeColor = "text-yellow-500";

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        {/* Track */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-700"
        />
        {/* Indicator */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${strokeColor} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-black text-white leading-none">{value}%</span>
        <span className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">EFF</span>
      </div>
    </div>
  );
};

export default TechnicianView;
