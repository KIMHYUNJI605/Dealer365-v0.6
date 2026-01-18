import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Moon, User, LayoutGrid, History, X, FileText, Car, Users, ChevronRight, FileQuestion } from 'lucide-react';
import WorkspaceTabs from './WorkspaceTabs';
import { useNavigation } from '../context/NavigationContext';
import { MOCK_ROS } from '../data/mockData';
import { ViewType } from '../types';

const Header: React.FC = () => {
  // In a real app, these would come from AuthContext or similar
  const branchName = "Downtown Luxury Motors";
  const userName = "Alex Mercer";
  
  const { toggleSidebar, openTab, userRole } = useNavigation();

  // Search State
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof MOCK_ROS>([]);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // Mock Recent Searches
  const RECENT_SEARCHES = [
    { label: 'RO-24-1042', type: 'ro' },
    { label: 'Sarah Connor', type: 'customer' },
    { label: 'BMW X5 Recalls', type: 'query' }
  ];

  // Handle Outside Click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchWrapperRef]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.trim() === '') {
        setSearchResults([]);
        return;
    }

    const lower = val.toLowerCase();
    // Filter MOCK_ROS by ID, Customer, Vehicle, or VIN
    const results = MOCK_ROS.filter(ro => 
        ro.id.toLowerCase().includes(lower) ||
        ro.customerName.toLowerCase().includes(lower) ||
        ro.vehicle.toLowerCase().includes(lower) ||
        ro.vin.toLowerCase().includes(lower)
    ).slice(0, 5); // Limit to 5 results for demo

    setSearchResults(results);
  };

  const handleResultClick = (ro: typeof MOCK_ROS[0]) => {
      openTab({
          id: `tab-${ro.id}`,
          type: ViewType.RO_DETAIL,
          title: ro.id,
          data: { roId: ro.id },
          isClosable: true
      });
      setIsFocused(false);
      setQuery('');
  };

  const getRoleLabel = () => {
      switch(userRole) {
          case 'MANAGER': return 'Service Manager';
          case 'SALES': return 'Sales Advisor';
          case 'SERVICE': return 'Service Advisor';
          case 'TECHNICIAN': return 'Master Technician';
          default: return 'User';
      }
  };

  const getRecentSearchBadgeStyle = (type: string) => {
    switch(type) {
      case 'ro': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'customer': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <header className="flex flex-col bg-white border-b border-gray-200 shadow-sm z-10 shrink-0 relative">
      {/* Top Bar: Brand, Search, Actions */}
      <div className="h-14 flex items-center justify-between px-4">
        {/* Left: Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">
                D
            </div>
            <div>
                <h1 className="text-sm font-bold tracking-tight text-[#1A1A1A] leading-none">DEALER365</h1>
                <span className="text-[10px] text-gray-500 uppercase font-medium tracking-wide">{branchName}</span>
            </div>
          </div>
        </div>

        {/* Center: Omni-Search */}
        <div className="flex-1 max-w-2xl mx-4 relative" ref={searchWrapperRef}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className={`transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              value={query}
              onFocus={() => setIsFocused(true)}
              onChange={handleSearch}
              placeholder="Search Customer, VIN, RO #..."
              className={`block w-full pl-10 pr-10 py-2 border rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white sm:text-sm transition-all ${isFocused ? 'border-blue-500 ring-1 ring-blue-500 shadow-sm' : 'border-gray-200'}`}
            />
            {query && (
                <button 
                    onClick={() => { setQuery(''); setSearchResults([]); }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                    <X size={14} />
                </button>
            )}
            {!query && !isFocused && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs border border-gray-200 rounded px-1.5 py-0.5">⌘K</span>
                </div>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {query === '' ? (
                      /* Recent Searches View */
                      <div className="p-2">
                          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Recent Searches</h3>
                          {RECENT_SEARCHES.map((item, idx) => (
                              <button key={idx} className="w-full text-left flex items-center px-3 py-2.5 hover:bg-gray-50 rounded-lg group transition-colors">
                                  <History size={16} className="text-gray-400 mr-3 group-hover:text-blue-500" />
                                  <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                                  <span className={`ml-auto text-[10px] border px-1.5 py-0.5 rounded uppercase font-bold tracking-wide ${getRecentSearchBadgeStyle(item.type)}`}>
                                    {item.type}
                                  </span>
                              </button>
                          ))}
                      </div>
                  ) : (
                      /* Live Results View */
                      <div className="py-2">
                          {searchResults.length > 0 ? (
                              <>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-2">Results</h3>
                                {searchResults.map((ro) => (
                                    <button 
                                        key={ro.id} 
                                        onClick={() => handleResultClick(ro)}
                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between group border-l-2 border-transparent hover:border-blue-500 transition-all"
                                    >
                                        <div className="flex items-center min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 shrink-0">
                                                <FileText size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-bold text-gray-900 mr-2">{ro.id}</span>
                                                    <span className={`text-[10px] px-1.5 rounded-full font-bold ${
                                                        ro.status === 'Working' ? 'bg-green-100 text-green-700' : 
                                                        ro.status.includes('Hold') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>{ro.status}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 truncate flex items-center mt-0.5">
                                                    <Users size={10} className="mr-1" />
                                                    <span className="font-medium mr-2">{ro.customerName}</span>
                                                    <span className="text-gray-300 mx-1">|</span>
                                                    <Car size={10} className="mr-1" />
                                                    <span className="truncate">{ro.vehicle}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500" />
                                    </button>
                                ))}
                                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
                                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center w-full">
                                        View all results for "{query}"
                                    </button>
                                </div>
                              </>
                          ) : (
                              <div className="p-8 text-center flex flex-col items-center justify-center">
                                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <FileQuestion size={24} className="text-gray-400" />
                                  </div>
                                  <h3 className="text-sm font-bold text-gray-900">No results found</h3>
                                  <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                                      We couldn't find anything matching "<span className="font-medium text-gray-900">{query}</span>".
                                  </p>
                                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                                      <span className="text-[10px] bg-gray-50 border border-gray-100 px-2 py-1 rounded text-gray-500 cursor-default">RO #</span>
                                      <span className="text-[10px] bg-gray-50 border border-gray-100 px-2 py-1 rounded text-gray-500 cursor-default">Customer Name</span>
                                      <span className="text-[10px] bg-gray-50 border border-gray-100 px-2 py-1 rounded text-gray-500 cursor-default">VIN</span>
                                  </div>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Moon size={18} />
          </button>

          <div className="h-6 w-px bg-gray-200 mx-2"></div>

          <button className="flex items-center space-x-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-medium text-xs ${userRole === 'TECHNICIAN' ? 'bg-green-600' : 'bg-blue-600'}`}>
              {userName.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-medium text-gray-700">{userName}</p>
              <p className="text-[10px] text-gray-500">{getRoleLabel()}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom: Workspace Tabs */}
      <WorkspaceTabs />
    </header>
  );
};

export default Header;