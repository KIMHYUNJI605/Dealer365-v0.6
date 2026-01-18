import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Flame,
  User,
  LayoutList,
  Kanban as KanbanIcon,
  Download,
  UserPlus,
  Tag,
  Trash2,
  X,
  Clock
} from 'lucide-react';
import { MOCK_LEADS } from '../data/mockData';
import { useNavigation } from '../context/NavigationContext';
import { ViewType } from '../types';

const CRMLeads: React.FC = () => {
  const { openTab } = useNavigation();
  const [viewMode, setViewMode] = useState<'LIST' | 'KANBAN'>('KANBAN');
  const [selection, setSelection] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Kanban Columns Definition
  const KANBAN_COLUMNS = [
      { id: 'new', title: 'New / Inquiry', statuses: ['Vehicle Inquiry', 'Initial Contact'], color: 'bg-blue-500' },
      { id: 'active', title: 'Test Drive', statuses: ['Test Drive'], color: 'bg-orange-500' },
      { id: 'neg', title: 'Negotiation', statuses: ['Negotiation'], color: 'bg-purple-500' },
      { id: 'close', title: 'F&I / Closing', statuses: ['Financial Review'], color: 'bg-green-500' }
  ];

  // Filter Logic (Simple implementation for search)
  const filteredLeads = MOCK_LEADS.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.interestModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    setSelection(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelection(filteredLeads.map(l => l.id));
      } else {
          setSelection([]);
      }
  };

  const handleLeadClick = (lead: typeof MOCK_LEADS[0]) => {
      openTab({
          id: `cust-${lead.id}`,
          type: ViewType.CUSTOMER_DETAIL,
          title: lead.name,
          data: { leadId: lead.id },
          isClosable: true
      });
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA]">
      
      {/* 1. Module Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 shrink-0">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Leads & Opportunities</h1>
                <p className="text-sm text-gray-500 mt-1">Manage pipeline, track interactions, and convert prospects.</p>
            </div>
            <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 flex items-center shadow-sm">
                    <Download size={16} className="mr-2" /> Export
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 flex items-center shadow-md active:scale-95 transition-transform">
                    <Plus size={16} className="mr-2" /> Add New Lead
                </button>
            </div>
        </div>
      </div>

      {/* 2. Filter & Toolbar (CONDITIONAL RENDERING FOR BULK ACTIONS) */}
      <div className={`px-6 py-3 flex items-center justify-between border-b sticky top-0 z-10 transition-colors duration-200 ${selection.length > 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
         
         {selection.length > 0 ? (
             // --- BULK ACTIONS TOOLBAR ---
             <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-top-2">
                 <div className="flex items-center space-x-4">
                     <button onClick={() => setSelection([])} className="p-1 hover:bg-blue-100 rounded-full text-blue-600 transition-colors" title="Clear Selection">
                        <X size={20} />
                     </button>
                     <span className="font-bold text-blue-900 text-sm">{selection.length} Selected</span>
                     
                     <div className="h-5 w-px bg-blue-200 mx-2"></div>
                     
                     <button className="flex items-center px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-bold rounded shadow-sm hover:bg-blue-50 transition-colors">
                        <UserPlus size={14} className="mr-2" /> Assign to Rep
                     </button>
                     <button className="flex items-center px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-bold rounded shadow-sm hover:bg-blue-50 transition-colors">
                        <Tag size={14} className="mr-2" /> Add Tag
                     </button>
                     <button className="flex items-center px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-bold rounded shadow-sm hover:bg-blue-50 transition-colors">
                        <Download size={14} className="mr-2" /> Export Selected
                     </button>
                 </div>
                 
                 <div className="flex items-center">
                     <button className="flex items-center px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded shadow-sm hover:bg-red-100 transition-colors">
                        <Trash2 size={14} className="mr-2" /> Delete
                     </button>
                 </div>
             </div>
         ) : (
             // --- STANDARD TOOLBAR ---
             <>
                 <div className="flex items-center space-x-2 flex-1 max-w-lg">
                     <div className="relative flex-1">
                         <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                         <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search leads by name, email, or vehicle..." 
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                         />
                     </div>
                     <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                         <Filter size={16} />
                     </button>
                 </div>

                 <div className="flex items-center space-x-2 border-l border-gray-200 pl-4 ml-4">
                     <span className="text-xs font-medium text-gray-500 mr-2">View:</span>
                     <button 
                        onClick={() => setViewMode('LIST')}
                        className={`p-1.5 rounded-md transition-colors ${viewMode === 'LIST' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                     >
                         <LayoutList size={18} />
                     </button>
                     <button 
                        onClick={() => setViewMode('KANBAN')}
                        className={`p-1.5 rounded-md transition-colors ${viewMode === 'KANBAN' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                     >
                         <KanbanIcon size={18} />
                     </button>
                 </div>
             </>
         )}
      </div>

      {/* 3. Main Content */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        {viewMode === 'LIST' ? (
            <div className="h-full overflow-auto p-6 bg-white">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="p-4 w-10">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    checked={filteredLeads.length > 0 && selection.length === filteredLeads.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="p-4">Lead Name / Source</th>
                            <th className="p-4">Interest / Budget</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Lead Score</th>
                            <th className="p-4">Last Activity</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredLeads.map((lead) => {
                            const isSelected = selection.includes(lead.id);
                            return (
                                <tr 
                                    key={lead.id} 
                                    onClick={() => handleLeadClick(lead)}
                                    className={`group hover:bg-blue-50/50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                                >
                                    <td className="p-4" onClick={(e) => { e.stopPropagation(); toggleSelection(lead.id); }}>
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected}
                                            onChange={() => toggleSelection(lead.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-700 font-bold text-xs mr-3 border border-white shadow-sm">
                                                {lead.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{lead.name}</div>
                                                <div className="text-xs text-gray-500">{lead.source}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{lead.interestModel}</div>
                                        <div className="text-xs text-gray-500">Est. Budget: $125k</div>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={lead.status} />
                                    </td>
                                    <td className="p-4">
                                        <ScoreIndicator score={lead.leadScore} />
                                    </td>
                                    <td className="p-4">
                                        <div className="text-gray-900 font-medium">{lead.lastContact}</div>
                                        <div className="text-xs text-gray-500">via Email</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors" title="Call"
                                            >
                                                <Phone size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Email"
                                            >
                                                <Mail size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors" title="SMS"
                                            >
                                                <MessageSquare size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredLeads.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-gray-500">
                                    No leads found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        ) : (
            // --- KANBAN VIEW ---
            <div className="h-full overflow-x-auto overflow-y-hidden p-6 whitespace-nowrap">
                <div className="flex space-x-4 h-full">
                    {KANBAN_COLUMNS.map(col => {
                        const colLeads = filteredLeads.filter(l => col.statuses.includes(l.status));
                        const totalValue = colLeads.length * 125000; // Mock value avg

                        return (
                            <div key={col.id} className="flex-shrink-0 w-80 flex flex-col h-full bg-gray-100/50 rounded-xl border border-gray-200">
                                {/* Column Header */}
                                <div className="p-3 border-b border-gray-200 bg-white rounded-t-xl sticky top-0 flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${col.color}`}></div>
                                        <h3 className="text-sm font-bold text-gray-800">{col.title}</h3>
                                        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-bold">{colLeads.length}</span>
                                    </div>
                                    <div className="text-xs font-medium text-gray-400">${(totalValue/1000000).toFixed(1)}M</div>
                                </div>

                                {/* Cards Container */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                                    {colLeads.map(lead => (
                                        <div 
                                            key={lead.id}
                                            draggable
                                            onClick={() => handleLeadClick(lead)}
                                            className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing group whitespace-normal"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center space-x-2">
                                                    {lead.leadScore >= 80 && (
                                                        <div className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex items-center">
                                                            <Flame size={10} className="mr-1 fill-current" /> Hot
                                                        </div>
                                                    )}
                                                    <span className="text-xs text-gray-400 font-mono">{lead.id}</span>
                                                </div>
                                                <button className="text-gray-300 hover:text-gray-600"><MoreHorizontal size={14} /></button>
                                            </div>
                                            
                                            <h4 className="font-bold text-gray-900 text-sm mb-1">{lead.name}</h4>
                                            <p className="text-xs text-gray-600 mb-3">{lead.interestModel}</p>
                                            
                                            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                                                <div className="flex items-center text-[10px] text-gray-500">
                                                    <Clock size={10} className="mr-1" /> {lead.lastContact}
                                                </div>
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                    {lead.name.charAt(0)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {colLeads.length === 0 && (
                                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                                            <p className="text-xs text-gray-400">No leads in this stage</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
      </div>

    </div>
  );
};

// --- Subcomponents ---

const StatsCard = ({ label, value, trend, icon: Icon, color, bg }: any) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className={`text-xs font-medium mt-1 ${color}`}>{trend}</p>
        </div>
        <div className={`p-3 rounded-lg ${bg} ${color}`}>
            <Icon size={20} />
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    let styles = "bg-gray-100 text-gray-600";
    if (status === 'Negotiation') styles = "bg-purple-50 text-purple-700 border border-purple-200";
    if (status === 'Test Drive') styles = "bg-blue-50 text-blue-700 border border-blue-200";
    if (status === 'Financial Review') styles = "bg-green-50 text-green-700 border border-green-200";
    if (status === 'Initial Contact') styles = "bg-yellow-50 text-yellow-700 border border-yellow-200";
    
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles}`}>
            {status}
        </span>
    );
};

const ScoreIndicator = ({ score }: { score: number }) => {
    // 0-100
    let color = 'bg-gray-300';
    let iconColor = 'text-gray-400';
    let label = 'Cold';
    
    if (score >= 60) {
        color = 'bg-orange-500';
        iconColor = 'text-orange-500';
        label = 'Warm';
    }
    if (score >= 80) {
        color = 'bg-red-500';
        iconColor = 'text-red-500';
        label = 'Hot';
    }

    return (
        <div className="flex items-center space-x-3">
             <div className="flex-1 w-24">
                 <div className="flex justify-between items-end mb-1">
                     <span className={`text-xs font-bold ${iconColor}`}>{score}</span>
                     <span className="text-[10px] text-gray-400 uppercase font-medium">{label}</span>
                 </div>
                 <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }}></div>
                 </div>
             </div>
             {score >= 80 && <Flame size={14} className="text-red-500 fill-red-500 animate-pulse" />}
        </div>
    );
};

export default CRMLeads;