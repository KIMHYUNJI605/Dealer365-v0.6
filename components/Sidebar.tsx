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
  Check
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { ViewType, UserRole } from '../types';

// Updated Menu Structure: Dashboard is now top-level
const MENU_STRUCTURE = [
  {
    id: "dashboard-home",
    title: "DASHBOARD",
    icon: LayoutDashboard,
    viewType: ViewType.DASHBOARD,
    submenu: null // Indicates top-level item
  },
  {
    id: "crm",
    title: "CRM",
    icon: Users,
    submenu: [
      { id: "crm-leads", label: "Leads & Opportunities", viewType: ViewType.CRM },
      { id: "crm-customers", label: "Customer 360", viewType: ViewType.CUSTOMER_360 },
      { id: "crm-activities", label: "Tasks & Calendar", viewType: ViewType.CALENDAR }
    ]
  },
  {
    id: "sales",
    title: "SALES",
    icon: Car,
    submenu: [
      { id: "sales-inventory", label: "Inventory Search", viewType: ViewType.SALES },
      { id: "sales-showroom", label: "Digital Showroom (3D)", viewType: ViewType.SALES },
      { id: "sales-desking", label: "Deals & Quoting", viewType: ViewType.SALES },
      { id: "sales-contract", label: "Contracts", viewType: ViewType.SALES }
    ]
  },
  {
    id: "service",
    title: "SERVICE",
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
    title: "ADMIN",
    icon: Settings,
    submenu: [
      { id: "admin-financials", label: "Financial Reports", viewType: ViewType.ADMIN },
      { id: "admin-users", label: "User Management", viewType: ViewType.ADMIN }
    ]
  }
];

const ROLES: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'MANAGER', label: 'Manager (Exec)', icon: ShieldAlert, color: 'text-purple-600' },
    { id: 'SALES', label: 'Sales Advisor', icon: Briefcase, color: 'text-blue-600' },
    { id: 'SERVICE', label: 'Service Advisor', icon: Wrench, color: 'text-orange-600' },
    { id: 'TECHNICIAN', label: 'Technician', icon: HardHat, color: 'text-green-600' },
];

const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar, openTab, userRole, setUserRole } = useNavigation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['SERVICE']);
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
    // If it's top level (like Dashboard), open it directly
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

    // Otherwise toggle accordion
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
        relative bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-20 shadow-sm
        ${sidebarOpen ? 'w-64' : 'w-16'}
      `}
    >
      {/* Sidebar Header / Toggle */}
      <div className="h-14 flex items-center justify-center border-b border-gray-100 shrink-0">
         <button 
           onClick={toggleSidebar}
           className="p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
         >
           {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
         </button>
      </div>

      {/* Menu Content */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {MENU_STRUCTURE.map((category) => {
            const isExpanded = expandedCategories.includes(category.title);
            const Icon = category.icon;
            const hasSubmenu = !!category.submenu;

            return (
              <li key={category.id}>
                {/* Category Header */}
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={`
                    w-full flex items-center p-2 rounded-lg transition-colors group
                    ${isExpanded && sidebarOpen ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                    ${!sidebarOpen ? 'justify-center' : 'justify-between'}
                  `}
                  title={!sidebarOpen ? category.title : ''}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} className="shrink-0" />
                    {sidebarOpen && <span className="text-sm font-bold tracking-wide">{category.title}</span>}
                  </div>
                  {sidebarOpen && hasSubmenu && (
                    <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} text-gray-400`} 
                    />
                  )}
                </button>

                {/* Submenu (Only visible if expanded and sidebar is open) */}
                {sidebarOpen && hasSubmenu && isExpanded && (
                  <ul className="mt-1 ml-4 space-y-0.5 border-l border-gray-200 pl-2 animate-in slide-in-from-left-2 duration-200">
                    {category.submenu?.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => handleSubmenuClick(sub)}
                          className="w-full text-left flex items-center px-3 py-2 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          {sub.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Role Switcher */}
      <div className="p-3 border-t border-gray-100 shrink-0" ref={roleMenuRef}>
        <div className="relative">
            {/* Role Menu Popup */}
            {showRoleMenu && (
                <div className={`absolute bottom-full left-0 mb-2 w-56 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 ${!sidebarOpen ? 'left-14' : ''}`}>
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Switch Role</p>
                    </div>
                    <div className="p-1">
                        {ROLES.map(role => (
                            <button
                                key={role.id}
                                onClick={() => handleRoleSelect(role.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors ${userRole === role.id ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`p-1.5 rounded-md ${role.color} bg-opacity-10 bg-current`}>
                                        <role.icon size={14} />
                                    </div>
                                    <span className={`font-medium ${userRole === role.id ? 'text-gray-900' : 'text-gray-600'}`}>{role.label}</span>
                                </div>
                                {userRole === role.id && <Check size={14} className="text-blue-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Profile Button */}
            <button 
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`w-full flex items-center p-2 rounded-xl transition-all hover:bg-gray-100 active:scale-95 ${sidebarOpen ? 'bg-gray-50 border border-gray-200' : 'justify-center'}`}
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${
                    userRole === 'MANAGER' ? 'bg-purple-600' : 
                    userRole === 'TECHNICIAN' ? 'bg-green-600' : 
                    userRole === 'SALES' ? 'bg-blue-600' :
                    'bg-orange-600'
                }`}>
                    {sidebarOpen ? 'AM' : <Settings size={14} />}
                </div>
                
                {sidebarOpen && (
                    <div className="ml-3 text-left flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">Alex Mercer</p>
                        <p className={`text-[10px] font-bold uppercase truncate ${currentRoleConfig.color}`}>
                            {currentRoleConfig.label}
                        </p>
                    </div>
                )}
                
                {sidebarOpen && <Settings size={14} className="text-gray-400 ml-2" />}
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;