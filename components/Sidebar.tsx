import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Wrench, 
  Settings,
  ChevronLeft,
  Menu,
  ChevronDown,
  ShieldAlert,
  Briefcase,
  HardHat,
  Check,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { ViewType, UserRole } from '../types';

// Updated Menu Structure
const MENU_STRUCTURE = [
  {
    id: "dashboard-home",
    title: "Dashboard",
    icon: LayoutDashboard,
    viewType: ViewType.DASHBOARD,
    submenu: null 
  },
  {
    id: "crm",
    title: "CRM Suite",
    icon: Users,
    submenu: [
      { id: "crm-leads", label: "Leads & Opportunities", viewType: ViewType.CRM },
      { id: "crm-customers", label: "Customer 360", viewType: ViewType.CUSTOMER_360 },
      { id: "crm-activities", label: "Tasks & Calendar", viewType: ViewType.CALENDAR }
    ]
  },
  {
    id: "sales",
    title: "Sales Floor",
    icon: Car,
    submenu: [
      { id: "sales-inventory", label: "Inventory Search", viewType: ViewType.SALES },
      { id: "sales-showroom", label: "Digital Showroom", viewType: ViewType.SALES },
      { id: "sales-desking", label: "Deals & Desking", viewType: ViewType.DEAL_DESK },
      { id: "sales-contract", label: "Contracts", viewType: ViewType.SALES }
    ]
  },
  {
    id: "service",
    title: "Service Ops",
    icon: Wrench,
    submenu: [
      { id: "svc-scheduler", label: "Scheduler", viewType: ViewType.SERVICE },
      { id: "svc-reception", label: "Reception Lane", viewType: ViewType.SERVICE },
      { id: "svc-ro", label: "RO Center", viewType: ViewType.RO_DETAIL },
      { id: "svc-dispatch", label: "Dispatch Board", viewType: ViewType.SERVICE },
      { id: "svc-tech", label: "Technician Hub", viewType: ViewType.TECH_VIEW },
      { id: "svc-parts", label: "Parts & Inventory", viewType: ViewType.SERVICE }
    ]
  },
  {
    id: "admin",
    title: "Admin",
    icon: Settings,
    submenu: [
      { id: "admin-financials", label: "Financial Reports", viewType: ViewType.ADMIN },
      { id: "admin-users", label: "User Management", viewType: ViewType.ADMIN }
    ]
  }
];

const ROLES: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'MANAGER', label: 'Manager', icon: ShieldAlert, color: 'text-purple-600' },
    { id: 'SALES', label: 'Sales', icon: Briefcase, color: 'text-blue-600' },
    { id: 'SERVICE', label: 'Service', icon: Wrench, color: 'text-orange-600' },
    { id: 'TECHNICIAN', label: 'Technician', icon: HardHat, color: 'text-green-600' },
];

const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar, openTab, userRole, setUserRole } = useNavigation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Service Ops']);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setShowRoleMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (category: typeof MENU_STRUCTURE[0]) => {
    if (!category.submenu) {
        openTab({
            id: category.id,
            type: category.viewType!,
            title: category.title,
            icon: category.icon,
            isClosable: false
        });
        return;
    }

    if (!sidebarOpen) {
        toggleSidebar();
        setExpandedCategories([category.title]);
        return;
    }
    setExpandedCategories(prev => 
      prev.includes(category.title) 
        ? prev.filter(t => t !== category.title) 
        : [...prev, category.title]
    );
  };

  const handleSubmenuClick = (item: any) => {
    openTab({
      id: `tab-${item.id}`,
      type: item.viewType,
      title: item.label,
      icon: undefined,
      isClosable: true,
    });
  };

  const handleRoleSelect = (role: UserRole) => {
      setUserRole(role);
      setShowRoleMenu(false);
  };

  const currentRoleConfig = ROLES.find(r => r.id === userRole) || ROLES[0];

  return (
    <aside 
      className={`
        relative bg-surface border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-20 shadow-sm
        ${sidebarOpen ? 'w-64' : 'w-20'}
      `}
    >
      {/* Sidebar Header / Brand / Toggle */}
      <div className="h-16 flex items-center justify-between px-4 shrink-0 border-b border-gray-50 mb-2">
         {sidebarOpen ? (
             <div className="flex items-center space-x-2 overflow-hidden">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
                    D
                </div>
                <span className="font-bold text-lg tracking-tight text-gray-900 truncate">DEALER365</span>
             </div>
         ) : (
            <div className="w-full flex justify-center">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    D
                </div>
            </div>
         )}
         
         {sidebarOpen && (
            <button 
                onClick={toggleSidebar}
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
                <ChevronLeft size={18} />
            </button>
         )}
      </div>

      {!sidebarOpen && (
          <div className="flex justify-center mb-4">
               <button 
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <Menu size={20} />
            </button>
          </div>
      )}

      {/* Menu Content */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <ul className="space-y-1">
          {MENU_STRUCTURE.map((category) => {
            const isExpanded = expandedCategories.includes(category.title);
            const Icon = category.icon;
            const hasSubmenu = !!category.submenu;
            
            // Check if any child is active (simplification: we'd need access to activeTabId, 
            // but for now we just style the parent)

            return (
              <li key={category.id}>
                {/* Category Header */}
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={`
                    w-full flex items-center rounded-lg transition-all duration-200 group relative
                    ${!sidebarOpen ? 'justify-center py-3' : 'justify-between px-3 py-2.5'}
                    ${isExpanded && hasSubmenu && sidebarOpen ? 'bg-gray-50 text-gray-900' : 'text-text-secondary hover:bg-surface-hover hover:text-text-main'}
                  `}
                  title={!sidebarOpen ? category.title : ''}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                        size={20} 
                        className={`shrink-0 transition-colors ${isExpanded && sidebarOpen ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
                    />
                    {sidebarOpen && (
                        <span className={`text-sm ${isExpanded ? 'font-semibold' : 'font-medium'}`}>
                            {category.title}
                        </span>
                    )}
                  </div>
                  
                  {sidebarOpen && hasSubmenu && (
                    <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 text-gray-400 ${isExpanded ? 'rotate-180 text-gray-600' : ''}`} 
                    />
                  )}
                </button>

                {/* Submenu */}
                {sidebarOpen && hasSubmenu && isExpanded && (
                  <div className="overflow-hidden animate-in slide-in-from-top-1 duration-200">
                    <ul className="mt-1 ml-[1.35rem] pl-4 border-l border-gray-200 space-y-0.5 py-1">
                        {category.submenu?.map((sub) => (
                        <li key={sub.id}>
                            <button
                            onClick={() => handleSubmenuClick(sub)}
                            className="w-full text-left flex items-center px-3 py-2 text-[13px] font-medium text-text-secondary hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                            >
                            {sub.label}
                            </button>
                        </li>
                        ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Role Switcher */}
      <div className="p-4 border-t border-gray-100 shrink-0" ref={roleMenuRef}>
        <div className="relative">
            {/* Role Menu Popup */}
            {showRoleMenu && (
                <div className={`absolute bottom-full left-0 mb-3 w-56 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 ${!sidebarOpen ? 'left-14' : ''}`}>
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Switch Workspace</p>
                    </div>
                    <div className="p-1">
                        {ROLES.map(role => (
                            <button
                                key={role.id}
                                onClick={() => handleRoleSelect(role.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors ${userRole === role.id ? 'bg-primary-50' : ''}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`p-1.5 rounded-md ${role.color} bg-opacity-10 bg-current`}>
                                        <role.icon size={14} />
                                    </div>
                                    <span className={`font-medium ${userRole === role.id ? 'text-gray-900' : 'text-gray-600'}`}>{role.label}</span>
                                </div>
                                {userRole === role.id && <Check size={14} className="text-primary-600" />}
                            </button>
                        ))}
                        <div className="h-px bg-gray-100 my-1"></div>
                        <button className="w-full flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                            <LogOut size={14} className="mr-3" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Profile Button */}
            <button 
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`w-full flex items-center p-2 rounded-xl transition-all hover:bg-gray-50 active:scale-95 border border-transparent ${sidebarOpen ? 'hover:border-gray-200' : 'justify-center'}`}
            >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white ${
                    userRole === 'MANAGER' ? 'bg-purple-600' : 
                    userRole === 'TECHNICIAN' ? 'bg-green-600' : 
                    userRole === 'SALES' ? 'bg-blue-600' :
                    'bg-orange-600'
                }`}>
                    {sidebarOpen ? 'AM' : <Settings size={16} />}
                </div>
                
                {sidebarOpen && (
                    <div className="ml-3 text-left flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate leading-none">Alex Mercer</p>
                        <p className={`text-[11px] font-medium mt-1 truncate ${currentRoleConfig.color}`}>
                            {currentRoleConfig.label}
                        </p>
                    </div>
                )}
                
                {sidebarOpen && <Settings size={16} className="text-gray-300 ml-2 group-hover:text-gray-500" />}
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;