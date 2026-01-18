import React, { useState } from 'react';
import { 
    Phone, 
    Mail, 
    MessageSquare, 
    MapPin, 
    Star, 
    Clock, 
    MoreHorizontal, 
    ArrowUpRight, 
    Car, 
    Briefcase,
    Zap,
    Plus,
    AlertCircle,
    XCircle,
    FileText,
    Shield,
    ArrowLeft
} from 'lucide-react';
import { MOCK_CUSTOMER_PROFILE, MOCK_TIMELINE, MOCK_CUSTOMERS } from '../data/mockData';

// Icons map for timeline
const ACTIVITY_ICONS: Record<string, any> = {
    'VISIT': MapPin,
    'CALL': Phone,
    'EMAIL': Mail,
    'SERVICE_RO': Briefcase,
    'SERVICE_DECLINED': XCircle,
    'VEHICLE_PURCHASE': Car,
};

interface CustomerDetailProps {
    customerId?: string;
    onBack?: () => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customerId, onBack }) => {
  // If we have an ID, try to find basic info from MOCK_CUSTOMERS to supplement profile
  // For this mock, we fallback to MOCK_CUSTOMER_PROFILE which is now James Miller
  const basicInfo = MOCK_CUSTOMERS.find(c => c.id === customerId);
  
  // Merge basic info with detailed profile (simulating a full fetch)
  const profile = basicInfo ? { ...MOCK_CUSTOMER_PROFILE, ...basicInfo } : MOCK_CUSTOMER_PROFILE;

  const [filter, setFilter] = useState<'ALL' | 'SALES' | 'SERVICE'>('ALL');

  // Filter Timeline
  const timelineEvents = MOCK_TIMELINE.filter(evt => {
      if (filter === 'ALL') return true;
      return evt.category === filter || evt.category === 'COMMS'; // Always show comms
  });

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
      
      {/* 1. Header (Sticky) */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0 z-20 shadow-sm flex justify-between items-center sticky top-0">
         <div className="flex items-center space-x-4">
            {onBack && (
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                    <ArrowLeft size={20} />
                </button>
            )}
            <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold">
                {profile.name.charAt(0)}{profile.name.split(' ')[1]?.charAt(0)}
            </div>
            <div>
                <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-100 text-yellow-800 font-bold border border-yellow-200 uppercase tracking-wide">
                        {profile.tier}
                    </span>
                    <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                        <Star size={10} className="mr-1 fill-current" /> {profile.sentiment}
                    </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center"><MapPin size={10} className="mr-1" /> {profile.address || 'Springfield, IL'}</span>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center"><Mail size={10} className="mr-1" /> {profile.email}</span>
                </div>
            </div>
         </div>

         {/* Header Quick Actions */}
         <div className="flex items-center space-x-3">
             <div className="hidden md:flex space-x-1 mr-4 border-r border-gray-200 pr-4">
                 <QuickActionBtn icon={Phone} label="Call" />
                 <QuickActionBtn icon={Mail} label="Email" />
                 <QuickActionBtn icon={MessageSquare} label="SMS" />
             </div>
             <button className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm active:scale-95 transition-transform">
                 <Plus size={16} className="mr-2" /> New Opportunity
             </button>
             <button className="flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                 <MoreHorizontal size={16} />
             </button>
         </div>
      </div>

      {/* 2. Main 3-Column Grid */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* LEFT COLUMN: Customer Info & Garage (Span 3) */}
            <div className="col-span-12 lg:col-span-3 flex flex-col space-y-6 overflow-y-auto pr-2 pb-10">
                
                {/* Stats Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">LTV Revenue</div>
                        <div className="text-lg font-bold text-gray-900">${profile.ltv.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">NPS Score</div>
                        <div className="text-lg font-bold text-green-600 flex items-center">
                            {profile.nps} <Star size={14} className="ml-1 fill-current" />
                        </div>
                    </div>
                </div>

                {/* Garage Section */}
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                        <Car size={14} className="mr-2" /> Garage ({profile.garage.length})
                    </h3>
                    <div className="space-y-4">
                        {profile.garage.map((car, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:border-blue-300 transition-colors">
                                <div className="h-24 overflow-hidden relative">
                                    <img src={car.image} className="w-full h-full object-cover" alt={car.model} />
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase shadow-sm ${
                                            car.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {car.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h4 className="font-bold text-gray-900 text-sm">{car.year} {car.make} {car.model}</h4>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="text-xs text-gray-500 font-mono">{car.vin}</div>
                                    </div>
                                    
                                    {/* Warranty Status */}
                                    <div className={`mt-3 flex items-center text-xs p-2 rounded ${
                                        car.warranty === 'Expired' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                                    }`}>
                                        <Shield size={12} className="mr-1.5" />
                                        <span className="font-medium">{car.warranty === 'Expired' ? 'Warranty Expired' : car.warranty}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CENTER COLUMN: Unified Timeline (Span 6) */}
            <div className="col-span-12 lg:col-span-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full">
                {/* Timeline Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center">
                        <Clock size={16} className="mr-2 text-gray-500" /> Customer Timeline
                    </h3>
                    <div className="flex space-x-1 bg-gray-200 p-0.5 rounded-lg">
                        {['ALL', 'SALES', 'SERVICE'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                                    filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline Feed */}
                <div className="flex-1 overflow-y-auto p-6 bg-white relative">
                    <div className="absolute top-6 bottom-6 left-8 w-px bg-gray-200"></div>
                    <div className="space-y-8 relative">
                        {timelineEvents.map((evt) => {
                            const Icon = ACTIVITY_ICONS[evt.type] || Clock;
                            // Styling Logic
                            let iconColor = 'bg-gray-400';
                            let iconBg = 'bg-gray-100';
                            let borderColor = 'border-gray-100';

                            if (evt.category === 'SALES') { iconColor = 'bg-green-500'; iconBg = 'bg-green-50'; borderColor = 'border-green-100'; }
                            if (evt.category === 'SERVICE') { iconColor = 'bg-blue-500'; iconBg = 'bg-blue-50'; borderColor = 'border-blue-100'; }
                            if (evt.type === 'SERVICE_DECLINED') { iconColor = 'bg-red-500'; iconBg = 'bg-red-50'; borderColor = 'border-red-100'; }

                            return (
                                <div key={evt.id} className="relative pl-10 group">
                                    {/* Timeline Node */}
                                    <div className={`absolute left-0 top-0 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10 ${iconColor}`}>
                                        <Icon size={10} className="text-white" />
                                    </div>

                                    {/* Event Card */}
                                    <div className={`bg-white rounded-lg border ${borderColor} p-4 hover:shadow-md transition-shadow relative ${iconBg}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{evt.type.replace('_', ' ')}</span>
                                                <h4 className="text-sm font-bold text-gray-900">{evt.title}</h4>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{evt.date}</span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{evt.description}</p>
                                        
                                        {/* Specific Metadata */}
                                        {evt.type === 'SERVICE_DECLINED' && (
                                            <div className="mt-3 bg-white border border-red-200 rounded px-3 py-2 flex items-center justify-between text-red-700">
                                                <span className="text-xs font-bold flex items-center">
                                                    <AlertCircle size={12} className="mr-1" /> Risk: Lost Revenue
                                                </span>
                                                <span className="text-sm font-mono font-bold">-${evt.amount?.toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        {evt.roId && (
                                            <div className="mt-2 inline-flex items-center px-2 py-1 bg-white border border-blue-200 text-blue-600 text-xs font-mono rounded">
                                                <FileText size={10} className="mr-1" /> {evt.roId}
                                            </div>
                                        )}

                                        <div className="flex items-center mt-3 text-xs text-gray-400 pt-2 border-t border-gray-200/50">
                                            <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-[8px] font-bold text-white mr-1.5">
                                                {evt.user.charAt(0)}
                                            </div>
                                            by {evt.user}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Intelligence & Opportunities (Span 3) */}
            <div className="col-span-12 lg:col-span-3 flex flex-col space-y-6 overflow-y-auto pb-10">
                
                {/* AI Next Best Action */}
                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 bg-white/10 w-24 h-24 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
                    
                    <div className="flex items-center space-x-2 mb-4">
                        <Zap size={18} className="text-yellow-400 fill-current" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-100">Next Best Action</h3>
                    </div>

                    <div className="space-y-4">
                        {profile.aiInsights.map((insight, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold px-1.5 rounded uppercase ${
                                        insight.priority === 'High' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                    }`}>
                                        {insight.priority}
                                    </span>
                                    <span className="text-[10px] text-indigo-200 font-mono">{insight.type}</span>
                                </div>
                                <h4 className="font-bold text-sm mb-1">{insight.label}</h4>
                                <p className="text-xs text-indigo-100 leading-tight opacity-80 mb-2">{insight.reason}</p>
                                <button className="w-full bg-white text-indigo-900 text-xs font-bold py-1.5 rounded shadow-sm hover:bg-indigo-50 transition-colors">
                                    {insight.action}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Opportunities */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 text-sm flex items-center">
                            <ArrowUpRight size={16} className="mr-2 text-green-600" /> Active Deals
                        </h3>
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-1.5 py-0.5 rounded-full">{profile.opportunities.length}</span>
                    </div>
                    <div className="p-2 space-y-2">
                        {profile.opportunities.map(opp => (
                            <div key={opp.id} className="p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200 cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div className="font-bold text-gray-900 text-sm">{opp.model}</div>
                                    <div className="text-green-600 font-bold text-xs">{opp.probability}%</div>
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5 mb-2">Stage: <span className="font-medium text-gray-700">{opp.stage}</span></div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${opp.probability}%` }}></div>
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="text-xs font-mono text-gray-400">{opp.id}</span>
                                    <span className="text-xs font-bold text-gray-900">${opp.value.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                        {profile.opportunities.length === 0 && (
                            <div className="p-4 text-center text-gray-400 text-xs">
                                No active opportunities.
                            </div>
                        )}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                        <button className="w-full py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded flex items-center justify-center">
                            <Plus size={12} className="mr-1" /> Add Opportunity
                        </button>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionBtn = ({ icon: Icon, label }: any) => (
    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title={label}>
        <Icon size={18} />
    </button>
);

export default CustomerDetail;