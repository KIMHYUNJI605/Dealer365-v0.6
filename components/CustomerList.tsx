import React, { useState } from 'react';
import { 
    Search, 
    Filter, 
    Plus, 
    Users, 
    ArrowUpRight, 
    Download,
    Star,
    Car,
    AlertCircle,
    UserCheck,
    Phone,
    Mail,
    X
} from 'lucide-react';
import { MOCK_CUSTOMERS } from '../data/mockData';

interface CustomerListProps {
    onSelectCustomer: (customerId: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter Logic
  const filteredCustomers = MOCK_CUSTOMERS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.vehicles.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA]">
      
      {/* 1. Module Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 shrink-0">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer 360 Database</h1>
                <p className="text-sm text-gray-500 mt-1">Unified view of all customer interactions, sales history, and service records.</p>
            </div>
            <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 flex items-center shadow-sm">
                    <Download size={16} className="mr-2" /> Export
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 flex items-center shadow-md active:scale-95 transition-transform">
                    <Plus size={16} className="mr-2" /> Add Customer
                </button>
            </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
            <StatsCard label="Total Customers" value="2,450" trend="+15 New" icon={Users} color="text-blue-600" bg="bg-blue-50" />
            <StatsCard label="Retention Rate" value="88.2%" trend="+1.5%" icon={UserCheck} color="text-green-600" bg="bg-green-50" />
            <StatsCard label="VIP Platinum" value="125" trend="Top 5%" icon={Star} color="text-purple-600" bg="bg-purple-50" />
            <StatsCard label="At Risk" value="42" trend="Needs Action" icon={AlertCircle} color="text-red-600" bg="bg-red-50" />
        </div>
      </div>

      {/* 2. Filter & Toolbar */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 flex flex-col">
         <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 max-w-4xl">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, email, or vehicle..." 
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                
                {/* Tier Filter */}
                <div className="relative">
                    <select 
                        value={tierFilter}
                        onChange={(e) => setTierFilter(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer text-gray-700 font-medium"
                    >
                        <option value="ALL">All Tiers</option>
                        <option value="VIP Platinum">VIP Platinum</option>
                        <option value="VIP Gold">VIP Gold</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer text-gray-700 font-medium"
                    >
                        <option value="ALL">All Status</option>
                        <option value="Active">Active</option>
                        <option value="At Risk">At Risk</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50" title="Advanced Filters">
                    <Filter size={16} />
                </button>
            </div>
            <div className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                Showing {filteredCustomers.length} of {MOCK_CUSTOMERS.length} records
            </div>
         </div>

         {/* Active Filter Chips */}
         {(tierFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <div className="px-6 pb-3 flex items-center space-x-2 animate-in slide-in-from-top-1">
                <span className="text-xs font-medium text-gray-500 mr-2">Applied Filters:</span>
                
                {tierFilter !== 'ALL' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                        {tierFilter}
                        <button onClick={() => setTierFilter('ALL')} className="ml-1.5 hover:text-purple-900 rounded-full hover:bg-purple-100 p-0.5 transition-colors">
                            <X size={12} />
                        </button>
                    </span>
                )}

                {statusFilter !== 'ALL' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        {statusFilter}
                        <button onClick={() => setStatusFilter('ALL')} className="ml-1.5 hover:text-blue-900 rounded-full hover:bg-blue-100 p-0.5 transition-colors">
                            <X size={12} />
                        </button>
                    </span>
                )}

                <button 
                    onClick={() => { setTierFilter('ALL'); setStatusFilter('ALL'); }}
                    className="text-xs text-gray-400 hover:text-gray-600 underline ml-2 transition-colors"
                >
                    Clear All
                </button>
            </div>
         )}
      </div>

      {/* 3. Customer List */}
      <div className="flex-1 overflow-auto bg-white p-6">
        <div className="grid grid-cols-1 gap-4">
            {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                    <div 
                        key={customer.id} 
                        onClick={() => onSelectCustomer(customer.id)}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center justify-between">
                            {/* Profile Info */}
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-lg border border-gray-200">
                                    {customer.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center">
                                        {customer.name}
                                        {customer.tier.includes('VIP') && (
                                            <span className="ml-2 bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center">
                                                <Star size={10} className="mr-1 fill-current" /> {customer.tier}
                                            </span>
                                        )}
                                    </h3>
                                    <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center"><Mail size={12} className="mr-1" /> {customer.email}</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="flex items-center"><Phone size={12} className="mr-1" /> {customer.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats / Vehicles */}
                            <div className="flex items-center space-x-8">
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">Lifetime Value</div>
                                    <div className="text-sm font-bold text-gray-900">${customer.ltv.toLocaleString()}</div>
                                </div>
                                <div className="text-right hidden md:block">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">Vehicles</div>
                                    <div className="text-sm font-medium text-gray-700">{customer.vehicles.length} Owned</div>
                                </div>
                                <div className="text-right hidden lg:block">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">Last Visit</div>
                                    <div className="text-sm font-medium text-gray-700">{customer.lastVisit}</div>
                                </div>
                                
                                {/* Status */}
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    customer.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                    customer.status === 'At Risk' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {customer.status}
                                </div>

                                <div className="p-2 text-gray-300 group-hover:text-blue-500">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>
                        </div>
                        
                        {/* Vehicle Badges Footer */}
                        <div className="mt-4 pt-3 border-t border-gray-50 flex space-x-2 overflow-x-auto">
                            {customer.vehicles.map((v, i) => (
                                <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100 whitespace-nowrap">
                                    <Car size={10} className="mr-1.5 text-gray-400" />
                                    {v}
                                </span>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Users size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No customers found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// --- Subcomponent ---
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

export default CustomerList;