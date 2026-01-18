import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  AlertCircle, 
  Zap, 
  User, 
  GripVertical,
  CalendarDays,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MOCK_ROS, MOCK_TECHS, ROStatus } from '../data/mockData';

// Generate hours 08:00 to 18:00
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);

const DispatchBoard: React.FC = () => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [simulatingAI, setSimulatingAI] = useState(false);

  // Filter Unassigned Jobs
  const unassignedJobs = useMemo(() => {
    return MOCK_ROS.filter(ro => ro.technician === 'TBD');
  }, []);

  // Simulate AI Dispatch Action
  const handleSmartDispatch = () => {
    setSimulatingAI(true);
    setTimeout(() => {
      setSimulatingAI(false);
      // In a real app, this would update state/context
      alert("AI has optimized the schedule: 3 jobs assigned.");
    }, 1500);
  };

  return (
    <div className="flex h-full bg-[#F8F9FA] overflow-hidden">
      
      {/* LEFT PANEL: Unassigned Queue */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 z-10 shadow-sm">
        {/* Queue Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[#1A1A1A] flex items-center">
              Unassigned
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {unassignedJobs.length}
              </span>
            </h2>
            <button className="text-gray-400 hover:text-gray-600">
              <Filter size={16} />
            </button>
          </div>
          
          {/* Smart Dispatch Button */}
          <button 
            onClick={handleSmartDispatch}
            disabled={simulatingAI}
            className="w-full flex items-center justify-center space-x-2 bg-[#1A1A1A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait"
          >
            {simulatingAI ? (
               <span className="flex items-center"><span className="animate-spin mr-2">⟳</span> Optimizing...</span>
            ) : (
               <>
                 <Zap size={16} className="text-yellow-400 fill-current" />
                 <span>Smart Dispatch</span>
               </>
            )}
          </button>
        </div>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50">
          {unassignedJobs.map((ro) => (
            <div 
              key={ro.id}
              draggable
              onDragStart={() => setDraggedItem(ro.id)}
              onDragEnd={() => setDraggedItem(null)}
              className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing group relative transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{ro.id}</span>
                <GripVertical size={14} className="text-gray-300 opacity-0 group-hover:opacity-100" />
              </div>
              
              <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">{ro.vehicle}</h4>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">{ro.concern}</p>
              
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <span className="flex items-center text-[10px] text-gray-500 font-medium">
                  <Clock size={10} className="mr-1" />
                  {ro.totalEstimate > 0 ? `${(ro.totalEstimate / 150).toFixed(1)} hrs` : 'Diag'}
                </span>
                
                {/* Skill Badge Mock logic */}
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  ro.vehicle.includes('M50i') || ro.vehicle.includes('AMG') 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {ro.vehicle.includes('M50i') || ro.vehicle.includes('AMG') ? 'Master' : 'Lube/Tire'}
                </span>
              </div>

              {/* AI Recommendation Badge - Logic simulation */}
              {ro.id === 'RO-24-1048' && (
                 <div className="absolute -right-1 -top-1 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-full shadow-sm font-bold animate-bounce-slow">
                   AI Match
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN PANEL: Swimlane View */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        
        {/* Timeline Controls */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-4">
             <div className="flex items-center text-gray-800 font-bold text-lg">
                <CalendarDays size={20} className="mr-2 text-gray-500" />
                <span>October 27, 2023</span>
             </div>
             <div className="flex space-x-1">
               <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-l-md hover:bg-gray-200">Day</button>
               <button className="px-3 py-1 text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50">Week</button>
               <button className="px-3 py-1 text-xs font-medium bg-white border border-gray-200 text-gray-600 rounded-r-md hover:bg-gray-50">Techs</button>
             </div>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>On Track</div>
            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>Idle</div>
            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>Delayed</div>
          </div>
        </div>

        {/* Timeline Header */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <div className="w-48 shrink-0 border-r border-gray-200 p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Technician
          </div>
          <div className="flex-1 grid grid-cols-10 divide-x divide-gray-200">
            {HOURS.map(hour => (
              <div key={hour} className="text-center py-3 text-xs font-medium text-gray-400">
                {hour}:00
              </div>
            ))}
          </div>
        </div>

        {/* Swimlanes Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
            {/* Current Time Indicator Line (Mocked at 10:30) */}
            <div className="absolute top-0 bottom-0 left-[348px] w-px bg-red-500 z-20 pointer-events-none">
                <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-red-500"></div>
            </div>

            {MOCK_TECHS.map((tech) => (
                <div key={tech.id} className="flex border-b border-gray-100 h-24 group hover:bg-gray-50/50 transition-colors">
                    {/* Tech Info Column */}
                    <div className="w-48 shrink-0 border-r border-gray-200 p-3 flex flex-col justify-center relative bg-white z-10">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold">
                                {tech.initials}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">{tech.name}</div>
                                <div className="text-[10px] text-gray-500">{tech.skillLevel}</div>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px]">
                            <span className="text-gray-400">Efficiency</span>
                            <span className={`font-bold ${tech.efficiency >= 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                                {tech.efficiency}%
                            </span>
                        </div>
                        {/* AI Recommender Indicator */}
                        {tech.id === 'T-103' && draggedItem && (
                           <div className="absolute inset-0 bg-green-50/80 border-2 border-green-400 border-dashed rounded flex items-center justify-center pointer-events-none z-20">
                               <span className="text-green-700 font-bold text-xs flex items-center bg-white px-2 py-1 rounded shadow-sm">
                                   <Zap size={10} className="mr-1 fill-current" /> Best Match
                               </span>
                           </div>
                        )}
                    </div>

                    {/* Timeline Grid */}
                    <div className="flex-1 relative">
                        {/* Grid Background */}
                        <div className="absolute inset-0 grid grid-cols-10 divide-x divide-gray-100">
                            {HOURS.map(h => <div key={h} className="h-full"></div>)}
                        </div>
                        
                        {/* Job Blocks - Mock Mapping */}
                        {tech.currentRO && (
                            <JobBlock 
                                roId={tech.currentRO} 
                                techId={tech.id} 
                                // Random offsets for demo purposes
                                startOffset={tech.id === 'T-101' ? 2 : tech.id === 'T-102' ? 0.5 : 4} 
                                duration={tech.id === 'T-101' ? 3 : 2}
                                status={tech.status === 'Working' ? 'Running' : 'Delayed'}
                            />
                        )}
                        
                        {/* Mock Previous Jobs */}
                        {tech.id === 'T-102' && (
                             <JobBlock roId="RO-24-1040" techId={tech.id} startOffset={5} duration={1.5} status="Completed" />
                        )}

                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// --- Subcomponents ---

const JobBlock = ({ roId, techId, startOffset, duration, status }: any) => {
    // 10 columns representing 10 hours. 1 hour = 10% width.
    const leftPos = startOffset * 10; 
    const width = duration * 10;
    
    // Find basic info from Mock data if available
    const ro = MOCK_ROS.find(r => r.id === roId);
    
    let colorClass = "bg-blue-100 border-blue-300 text-blue-800";
    if (status === 'Running') colorClass = "bg-green-100 border-green-300 text-green-800";
    if (status === 'Delayed') colorClass = "bg-red-100 border-red-300 text-red-800";
    if (status === 'Completed') colorClass = "bg-gray-100 border-gray-300 text-gray-500 opacity-60";

    return (
        <div 
            className={`absolute top-2 bottom-2 rounded-md border text-xs overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all z-10 ${colorClass}`}
            style={{ 
                left: `${leftPos}%`, 
                width: `${width}%`,
                minWidth: '40px'
            }}
            title={ro ? `${ro.customerName} - ${ro.vehicle}` : roId}
        >
            <div className="px-2 py-1 h-full flex flex-col justify-center">
                <div className="font-bold truncate">{roId}</div>
                {ro && <div className="text-[9px] truncate opacity-80">{ro.vehicle}</div>}
                
                {status === 'Delayed' && (
                    <div className="absolute top-1 right-1">
                        <AlertTriangle size={10} className="text-red-600" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DispatchBoard;
