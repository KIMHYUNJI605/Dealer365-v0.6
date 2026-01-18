import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Car, 
  DollarSign, 
  ChevronRight, 
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react';
import { MOCK_DEALS, DealStatus } from '../data/mockData';
import { useNavigation } from '../context/NavigationContext';
import { ViewType } from '../types';

interface DealListProps {
    onSelectDeal: (dealId: string) => void;
}

const DealList: React.FC<DealListProps> = ({ onSelectDeal }) => {
    const { openTab, userRole } = useNavigation();
    const [searchTerm, setSearchTerm] = useState('');

    // --- KPI Calcs ---
    const pendingCount = MOCK_DEALS.filter(d => d.status === 'F&I Pending').length;
    const mtdGross = MOCK_DEALS.reduce((acc, d) => acc + d.gross, 0);
    const deliveriesToday = 3; // Mocked

    const handleNewDeal = () => {
        // Navigate to Showroom to start new
        openTab({
            id: 'sales-showroom',
            type: ViewType.SALES,
            title: 'Digital Showroom',
            icon: Car,
            isClosable: true
        });
    };

    const getStatusBadge = (status: DealStatus) => {
        switch(status) {
            case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'F&I Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Negotiation': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Sold': return 'bg-gray-800 text-white border-gray-900';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getProbabilityColor = (prob: number) => {
        if (prob >= 80) return 'bg-green-500';
        if (prob >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="flex flex-col h-full bg-[#F8F9FA]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-5 shrink-0">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Deal Management Hub</h1>
                        <p className="text-sm text-gray-500 mt-1">Track active negotiations, F&I approvals, and closed deals.</p>
                    </div>
                    <button 
                        onClick={handleNewDeal}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 flex items-center shadow-md active:scale-95 transition-transform"
                    >
                        <Plus size={16} className="mr-2" /> Start New Deal
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pending Approvals</p>
                            <div className="flex items-center mt-1">
                                <span className="text-2xl font-bold text-gray-900">{pendingCount}</span>
                                <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded ml-2 flex items-center">
                                    <Clock size={10} className="mr-1" /> Needs Action
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Briefcase size={20} />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">MTD Gross Profit</p>
                            <div className="flex items-center mt-1">
                                <span className="text-2xl font-bold text-gray-900">${mtdGross.toLocaleString()}</span>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded ml-2 flex items-center">
                                    <TrendingUp size={10} className="mr-1" /> +12%
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Deliveries Today</p>
                            <div className="flex items-center mt-1">
                                <span className="text-2xl font-bold text-gray-900">{deliveriesToday}</span>
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded ml-2 flex items-center">
                                    On Schedule
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Car size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-10">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search deals, customers, or stock #..." 
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center space-x-2 ml-4">
                    <button className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
                        <Filter size={14} className="mr-2" /> Filter
                    </button>
                    <button className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
                        <TrendingUp size={14} className="mr-2" /> Sort
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Vehicle</th>
                                <th className="px-6 py-3">Deal Structure</th>
                                <th className="px-6 py-3">Probability</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {MOCK_DEALS.filter(d => 
                                d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                d.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                d.id.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((deal) => (
                                <tr 
                                    key={deal.id} 
                                    onClick={() => onSelectDeal(deal.id)}
                                    className="group hover:bg-blue-50/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusBadge(deal.status as DealStatus)}`}>
                                            {deal.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">{deal.customerName}</span>
                                            <span className="text-[10px] text-gray-500 font-medium bg-gray-100 w-fit px-1.5 rounded mt-0.5">{deal.tier}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                <img src={deal.image} alt="Car" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 text-xs">{deal.vehicle}</div>
                                                <div className="text-[10px] text-gray-500 font-mono">STK: {deal.stockNo}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="font-bold text-gray-900">${deal.price.toLocaleString()}</div>
                                            {deal.monthly > 0 ? (
                                                <div className="text-xs text-gray-500">${deal.monthly}/mo</div>
                                            ) : (
                                                <div className="text-xs text-gray-500">Cash Deal</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-24">
                                            <div className="flex justify-between items-end mb-1">
                                                <span className="text-[10px] font-bold text-gray-500">{deal.probability}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${getProbabilityColor(deal.probability)}`} style={{ width: `${deal.probability}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded-full">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DealList;