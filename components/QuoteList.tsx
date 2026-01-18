import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  User, 
  Car, 
  DollarSign, 
  ChevronRight, 
  Clock
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { ViewType } from '../types';
import { MOCK_CONFIGURABLE_MODELS } from '../data/mockData';

// Mock Data for Quote List
const MOCK_QUOTES = [
    { id: 'Q-24-101', customer: 'James Miller', vehicle: 'Genesis GV80', price: 68450, status: 'Negotiation', date: '2 hours ago', probability: 'High' },
    { id: 'Q-24-102', customer: 'Sarah Connor', vehicle: 'BMW X5 M50i', price: 82100, status: 'Draft', date: 'Yesterday', probability: 'Medium' },
    { id: 'Q-24-103', customer: 'Tony Stark', vehicle: 'Audi e-tron GT', price: 145000, status: 'Manager Review', date: 'Oct 24, 2023', probability: 'High' },
    { id: 'Q-24-104', customer: 'Diana Prince', vehicle: 'Mercedes G63', price: 185000, status: 'Sent', date: 'Oct 22, 2023', probability: 'Low' },
];

const QuoteList: React.FC = () => {
    const { openTab } = useNavigation();
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenQuote = (quote: typeof MOCK_QUOTES[0]) => {
        // Find model ID for mock purposes (defaulting to GV80 if not found)
        const modelId = quote.vehicle.includes('911') ? 'MOD-911' : 'MOD-GV80';
        
        // Open the Deal Desk (Editor) with this data
        openTab({
            id: `deal-${quote.id}`,
            type: ViewType.DEAL_EDITOR,
            title: `Quote ${quote.id}`,
            icon: FileText,
            data: { 
                modelId: modelId,
                // Pass mock selections or empty to let DealDesk use defaults
                existingQuote: quote 
            },
            isClosable: true
        });
    };

    const handleNewQuote = () => {
        // Navigate to Showroom to start new
        openTab({
            id: 'sales-showroom',
            type: ViewType.SALES,
            title: 'Digital Showroom',
            icon: Car,
            isClosable: true
        });
    };

    return (
        <div className="flex flex-col h-full bg-[#F8F9FA]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-5 shrink-0">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Deals & Desking</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage active negotiations and saved quotes.</p>
                    </div>
                    <button 
                        onClick={handleNewQuote}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 flex items-center shadow-md active:scale-95 transition-transform"
                    >
                        <Plus size={16} className="mr-2" /> New Quote
                    </button>
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
                        placeholder="Search quotes, customers, or vehicles..." 
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 ml-4">
                    <Filter size={16} />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Quote ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Vehicle</th>
                                <th className="px-6 py-3">Deal Value</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Last Updated</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {MOCK_QUOTES.filter(q => q.customer.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase())).map((quote) => (
                                <tr 
                                    key={quote.id} 
                                    onClick={() => handleOpenQuote(quote)}
                                    className="group hover:bg-blue-50/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 font-mono text-blue-600 font-medium">{quote.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] mr-2 font-bold text-gray-600">
                                                {quote.customer.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-900">{quote.customer}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{quote.vehicle}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">${quote.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            quote.status === 'Negotiation' ? 'bg-purple-100 text-purple-700' :
                                            quote.status === 'Draft' ? 'bg-gray-100 text-gray-600' :
                                            quote.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                            {quote.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs flex items-center">
                                        <Clock size={12} className="mr-1" /> {quote.date}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 ml-auto" />
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

export default QuoteList;