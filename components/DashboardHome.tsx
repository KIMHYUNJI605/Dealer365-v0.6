import React, { useMemo } from 'react';
import { 
  ArrowUpRight, 
  Clock, 
  AlertTriangle,
  Car,
  DollarSign,
  Zap,
  MoreHorizontal,
  Calendar,
  Filter,
  CheckCircle2,
  ChevronRight,
  Users,
  TrendingUp,
  ClipboardList,
  Wrench,
  Flame,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { MOCK_ROS, MOCK_LEADS, MOCK_INVENTORY } from '../data/mockData';
import { ViewType } from '../types';
import TechnicianView from './TechnicianView';

const DashboardHome: React.FC = () => {
  const { openTab, userRole } = useNavigation();

  // If Technician, Render Dedicated Dark Mode View directly
  if (userRole === 'TECHNICIAN') {
      return <TechnicianView />;
  }

  // =========================================================================
  // DATA PREPARATION & LOGIC (Memoized for Performance)
  // =========================================================================
  
  // 1. MANAGER / EXEC View Data
  const managerData = useMemo(() => {
    // Mock calculations for Enterprise view
    return {
        kpis: [
            { label: "Total Revenue", value: "$1.2M", icon: DollarSign, trend: "+12.5%", color: "text-emerald-600", bg: "bg-emerald-50", sparkline: [0.8, 0.9, 1.0, 0.95, 1.1, 1.2] },
            { label: "Gross Profit", value: "$340k", icon: BarChart3, trend: "+8.1%", color: "text-blue-600", bg: "bg-blue-50", sparkline: [250, 280, 310, 300, 330, 340] },
            { label: "CSI Score", value: "96.4", icon: Target, trend: "Top 1%", color: "text-purple-600", bg: "bg-purple-50", sparkline: [92, 94, 93, 95, 96, 96.4] },
            { label: "Open ROs", value: MOCK_ROS.filter(r => r.status !== 'Closed').length, icon: Wrench, trend: "Busy", color: "text-orange-600", bg: "bg-orange-50", sparkline: [40, 45, 42, 48, 50, 48] }
        ],
        mainListTitle: "Department Performance",
        activeList: [
            { id: 'DEPT-01', name: 'Service Dept', status: 'On Target', metric: '$450k', secondary: '108% to Goal' },
            { id: 'DEPT-02', name: 'Sales - New', status: 'At Risk', metric: '$520k', secondary: '85% to Goal' },
            { id: 'DEPT-03', name: 'Sales - Pre-Owned', status: 'On Target', metric: '$180k', secondary: '110% to Goal' },
            { id: 'DEPT-04', name: 'Parts', status: 'On Target', metric: '$50k', secondary: '102% to Goal' },
        ],
        sidebarTitle: "EXECUTIVE ALERTS",
        sidebarList: [
            { id: 'AL-1', title: 'Inventory Aging', desc: '5 units > 60 days', type: 'warn' },
            { id: 'AL-2', title: 'Staffing', desc: '2 Techs out sick today', type: 'info' },
            { id: 'AL-3', title: 'CSI Alert', desc: 'Low score received (RO-992)', type: 'crit' }
        ]
    };
  }, []);

  // 2. SALES View Data
  const salesData = useMemo(() => {
    const totalInventoryValue = MOCK_INVENTORY.reduce((acc, car) => acc + car.price, 0);
    const activeLeads = MOCK_LEADS.length;
    const hotLeads = MOCK_LEADS.filter(l => l.leadScore >= 80);
    const unitsInStock = MOCK_INVENTORY.length;

    return {
      kpis: [
        { label: "Active Leads", value: activeLeads, icon: Users, trend: "+5 New", color: "text-blue-600", bg: "bg-blue-50", sparkline: [8, 10, 12, 11, 15, activeLeads] },
        { label: "Inventory Value", value: `$${(totalInventoryValue / 1000000).toFixed(1)}M`, icon: DollarSign, trend: "-$200k", color: "text-green-600", bg: "bg-green-50", sparkline: [2.1, 2.2, 2.1, 2.3, 2.4, 2.2] },
        { label: "Units in Stock", value: unitsInStock, icon: Car, trend: "Low Stock", color: "text-purple-600", bg: "bg-purple-50", sparkline: [15, 14, 12, 10, 8, unitsInStock] },
        { label: "Test Drives", value: 4, icon: Calendar, trend: "Today", color: "text-orange-600", bg: "bg-orange-50", sparkline: [1, 3, 2, 5, 2, 4] }
      ],
      mainListTitle: "Recent Leads",
      activeList: MOCK_LEADS, 
      sidebarTitle: "HOT OPPORTUNITIES",
      sidebarList: hotLeads
    };
  }, []);

  // 3. SERVICE View Data
  const serviceData = useMemo(() => {
    const activeROs = MOCK_ROS.filter(ro => ro.status !== 'Closed' && ro.status !== 'Ready');
    const actionRequired = MOCK_ROS.filter(ro => ['Approval Pending', 'Parts Hold'].includes(ro.status));
    const pipelineValue = activeROs.reduce((acc, ro) => acc + ro.totalEstimate, 0);
    
    // Sort active jobs by promise time
    const activeJobs = MOCK_ROS
      .filter(ro => !['Approval Pending', 'Parts Hold', 'Closed'].includes(ro.status))
      .sort((a, b) => new Date(a.promiseTime).getTime() - new Date(b.promiseTime).getTime());

    const priorityQueue = MOCK_ROS.filter(ro => ['Approval Pending', 'Parts Hold'].includes(ro.status));

    return {
      kpis: [
        { label: "Pipeline Value", value: `$${pipelineValue.toLocaleString()}`, icon: DollarSign, trend: "+8.2%", color: "text-blue-600", bg: "bg-blue-50", sparkline: [12500, 18200, 15400, 22100, 19800, 24500, pipelineValue] },
        { label: "Active ROs", value: activeROs.length, icon: Car, trend: "+2", color: "text-purple-600", bg: "bg-purple-50", sparkline: [18, 22, 20, 25, 24, 28, activeROs.length] },
        { label: "Action Required", value: actionRequired.length, icon: AlertTriangle, trend: "Needs Attn", isAlert: true, color: "text-red-600", bg: "bg-red-50", sparkline: [5, 2, 8, 4, 3, 6, actionRequired.length] },
        { label: "ELR", value: "$185", icon: Zap, trend: "+$5", color: "text-orange-600", bg: "bg-orange-50", sparkline: [175, 178, 180, 182, 184, 185] }
      ],
      mainListTitle: "Vehicles in Shop",
      activeList: activeJobs,
      sidebarTitle: "AI PRIORITY QUEUE",
      sidebarList: priorityQueue
    };
  }, []);

  // --- Helper: Select Data Source based on Role ---
  const currentData = userRole === 'MANAGER' ? managerData : userRole === 'SALES' ? salesData : serviceData;

  // --- Handlers ---
  const handleOpenRO = (roId: string) => {
    openTab({
      id: `tab-${roId}`,
      type: ViewType.RO_DETAIL,
      title: roId,
      data: { roId },
      isClosable: true
    });
  };

  const handleOpenLead = (leadId: string, name: string) => {
      openTab({
          id: `cust-${leadId}`,
          type: ViewType.CUSTOMER_360,
          title: name,
          data: { leadId },
          isClosable: true
      });
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
            <h2 className="text-xl font-bold text-[#1A1A1A]">
                {userRole === 'MANAGER' ? 'Executive Dashboard' : userRole === 'SALES' ? 'Sales Overview' : 'Service Operations'}
            </h2>
            <p className="text-xs text-[#5E5E5E] mt-0.5">
                {userRole === 'MANAGER' 
                 ? 'High-level view of dealership performance.'
                 : userRole === 'SALES' 
                 ? 'Tracking performance against monthly targets.' 
                 : 'Real-time overview of shop floor performance.'}
            </p>
        </div>
        <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
                <Calendar size={14} />
                <span>Today</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-1.5 bg-[#1A1A1A] text-white rounded-lg text-xs font-medium hover:bg-gray-800">
                <Filter size={14} />
                <span>Filter View</span>
            </button>
        </div>
      </div>

      {/* KPI Cards - Dense Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        {currentData.kpis.map((kpi, idx) => (
            <KPICard 
                key={idx}
                label={kpi.label} 
                value={kpi.value} 
                icon={kpi.icon}
                trend={kpi.trend}
                color={kpi.color}
                bg={kpi.bg}
                sparklineData={kpi.sparkline}
            />
        ))}
      </div>

      {/* Main Content: Split View */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left: Main List (Table) */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-0">
            <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800 text-sm">{currentData.mainListTitle}</h3>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {currentData.activeList.length}
                    </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                </button>
            </div>
            
            {/* Scrollable List Area */}
            <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {userRole === 'MANAGER' ? (
                    // MANAGER LIST VIEW (Dept Performance)
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-medium sticky top-0 z-10">
                            <tr>
                                <th className="px-3 py-2 rounded-tl-md rounded-bl-md">Department</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Revenue (MTD)</th>
                                <th className="px-3 py-2 rounded-tr-md rounded-br-md text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {(currentData.activeList as any[]).map((dept) => (
                                <tr key={dept.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="px-3 py-4 font-bold text-gray-900 text-xs">{dept.name}</td>
                                    <td className="px-3 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            dept.status === 'On Target' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {dept.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 text-xs font-mono text-gray-700">{dept.metric}</td>
                                    <td className="px-3 py-4 text-right text-xs font-bold text-blue-600">{dept.secondary}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : userRole === 'SALES' ? (
                    // SALES LIST VIEW (Leads)
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-medium sticky top-0 z-10">
                            <tr>
                                <th className="px-3 py-2 rounded-tl-md rounded-bl-md">Name</th>
                                <th className="px-3 py-2">Interest</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Score</th>
                                <th className="px-3 py-2 rounded-tr-md rounded-br-md text-right">Last Contact</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {(currentData.activeList as typeof MOCK_LEADS).map((lead) => (
                                <tr 
                                    key={lead.id} 
                                    onClick={() => handleOpenLead(lead.id, lead.name)}
                                    className="group hover:bg-blue-50/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-3 py-3 font-medium text-gray-900 text-xs">
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] mr-2 text-gray-600 font-bold">
                                                {lead.name.charAt(0)}
                                            </div>
                                            {lead.name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-xs text-gray-600">
                                        {lead.interestModel}
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            lead.status === 'Negotiation' ? 'bg-purple-50 text-purple-700' : 
                                            lead.status === 'Test Drive' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center space-x-1">
                                            <div className="h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${lead.leadScore > 80 ? 'bg-red-500' : 'bg-orange-400'}`} style={{ width: `${lead.leadScore}%` }}></div>
                                            </div>
                                            <span className="text-[10px] font-medium text-gray-500">{lead.leadScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-right text-xs text-gray-500">
                                        {lead.lastContact}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    // SERVICE LIST VIEW (ROs)
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-medium sticky top-0 z-10">
                            <tr>
                                <th className="px-3 py-2 rounded-tl-md rounded-bl-md">RO #</th>
                                <th className="px-3 py-2">Customer / Vehicle</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Tech</th>
                                <th className="px-3 py-2 rounded-tr-md rounded-br-md text-right">Promise</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {(currentData.activeList as typeof MOCK_ROS).map((ro) => (
                                <tr 
                                    key={ro.id} 
                                    onClick={() => handleOpenRO(ro.id)}
                                    className="group hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-3 py-3 font-medium text-blue-600 group-hover:underline text-xs">
                                        {ro.id}
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="font-medium text-gray-900 text-xs">{ro.customerName}</div>
                                        <div className="text-[10px] text-gray-500">{ro.vehicle}</div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <StatusBadge status={ro.status} />
                                    </td>
                                    <td className="px-3 py-3 text-xs text-gray-600 flex items-center">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[9px] mr-2 font-bold">
                                            {ro.technician.substring(0,2).toUpperCase()}
                                        </div>
                                        {ro.technician}
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                        <div className="flex items-center justify-end text-xs text-gray-500">
                                            <Clock size={12} className="mr-1" />
                                            {new Date(ro.promiseTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>

        {/* Right: Sidebar (Context Sensitive) */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
            
            {/* Sidebar Queue Panel */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className={`px-4 py-3 text-white flex justify-between items-center shrink-0 ${
                    userRole === 'SALES' ? 'bg-gradient-to-r from-blue-900 to-blue-800' : 'bg-gradient-to-r from-gray-900 to-gray-800'
                }`}>
                    <div className="flex items-center space-x-2">
                        <Zap size={14} className="text-yellow-400" fill="currentColor" />
                        <h3 className="font-semibold text-xs tracking-wide">{currentData.sidebarTitle}</h3>
                    </div>
                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">{currentData.sidebarList.length}</span>
                </div>

                <div className="p-3 space-y-3 bg-gray-50 flex-1 overflow-y-auto max-h-[400px]">
                    {currentData.sidebarList.length > 0 ? (
                        userRole === 'MANAGER' ? (
                            // MANAGER SIDEBAR ALERTS
                            (currentData.sidebarList as any[]).map(alert => (
                                <div key={alert.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-start space-x-3">
                                    <div className={`p-1.5 rounded-full ${alert.type === 'crit' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        <AlertTriangle size={12} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">{alert.title}</h4>
                                        <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{alert.desc}</p>
                                    </div>
                                </div>
                            ))
                        ) : userRole === 'SALES' ? (
                            // SALES SIDEBAR ITEMS
                            (currentData.sidebarList as typeof MOCK_LEADS).map(lead => (
                                <div 
                                    key={lead.id} 
                                    onClick={() => handleOpenLead(lead.id, lead.name)}
                                    className="bg-white p-3 rounded-lg border-l-4 border-l-red-500 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Hot Lead</span>
                                        <div className="flex items-center space-x-1">
                                            <Flame size={12} className="text-red-500 fill-red-500" />
                                            <span className="text-[10px] font-bold text-red-600">{lead.leadScore}</span>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">{lead.name}</h4>
                                    <p className="text-xs text-gray-600 mb-2">{lead.interestModel}</p>
                                </div>
                            ))
                        ) : (
                            // SERVICE SIDEBAR ITEMS
                            (currentData.sidebarList as typeof MOCK_ROS).map(ro => (
                                <div 
                                    key={ro.id} 
                                    onClick={() => handleOpenRO(ro.id)}
                                    className="bg-white p-3 rounded-lg border-l-4 border-l-red-500 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-gray-500">{ro.id}</span>
                                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                            {ro.status === 'Approval Pending' ? 'APPROVAL NEEDED' : 'PARTS DELAY'}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">{ro.customerName}</h4>
                                    <p className="text-xs text-gray-600 mb-2">{ro.vehicle}</p>
                                </div>
                            ))
                        )
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-xs">
                            <CheckCircle2 size={24} className="mx-auto mb-2 opacity-50" />
                            All clear. Good job!
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats or Appointments */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex-1">
                <h3 className="font-semibold text-gray-800 text-xs mb-3 uppercase tracking-wider">
                    {userRole === 'SALES' ? 'Today\'s Appointments' : 'Service Schedule'}
                </h3>
                <div className="space-y-3">
                    {MOCK_ROS.filter(ro => ro.status === 'Appointment').slice(0,4).map(apt => (
                        <div key={apt.id} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <div className="flex items-center space-x-3">
                                <div className="text-center w-8">
                                    <div className="text-[10px] text-gray-400 font-medium">AM</div>
                                    <div className="text-sm font-bold text-gray-900">
                                        {new Date(apt.promiseTime).getHours()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-800">{apt.customerName}</div>
                                    <div className="text-[10px] text-gray-500">{apt.vehicle}</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleOpenRO(apt.id)}
                                className="text-gray-300 group-hover:text-blue-600 transition-colors"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

// --- Subcomponents ---

const Sparkline = ({ data, className }: { data: number[], className?: string }) => {
    if (!data || data.length === 0) return null;
    
    // Simple SVG Sparkline
    const width = 60;
    const height = 24;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    // Create points string
    const points = data.map((d, i) => {
        const x = i * (width / (data.length - 1));
        const y = height - ((d - min) / range) * (height - 4) - 2; // -2 padding
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className={`overflow-visible ${className}`} preserveAspectRatio="none">
            <polyline 
                points={points} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="opacity-80"
            />
            {/* Dot at the end */}
            <circle 
                cx={width} 
                cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} 
                r="2" 
                fill="currentColor"
            />
        </svg>
    );
};

const KPICard = ({ label, value, icon: Icon, trend, color, bg, isAlert, sparklineData }: any) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-28 hover:border-gray-300 transition-colors relative">
        <div className="flex justify-between items-start">
            <div className={`p-1.5 rounded-lg ${bg} ${color}`}>
                <Icon size={16} />
            </div>
            {isAlert && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
        </div>
        <div>
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">{value}</div>
                    <div className="text-[10px] text-gray-500 font-medium uppercase mt-1">{label}</div>
                </div>
                <div className="flex flex-col items-end">
                    {sparklineData && (
                        <div className={`mb-1 ${color}`}>
                            <Sparkline data={sparklineData} />
                        </div>
                    )}
                    <span className={`text-[10px] font-bold ${color}`}>{trend}</span>
                </div>
            </div>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    let styles = "bg-gray-100 text-gray-600 border border-gray-200";
    
    // Green: Actionable/Good/Working
    if (['Ready', 'Working', 'Active Repair'].includes(status)) {
        styles = "bg-green-50 text-green-700 border border-green-200";
    }
    // Blue: Diagnosis/Inspection
    else if (['Diagnosis', 'Tech Inspection'].includes(status)) {
        styles = "bg-blue-50 text-blue-700 border border-blue-200";
    }
    // Yellow: Warning/Waiting on Decision
    else if (['Approval Pending', 'Estimate Review'].includes(status)) {
        styles = "bg-yellow-50 text-yellow-700 border border-yellow-200";
    }
    // Red: Stalled/Critical
    else if (['Parts Hold', 'Parts Ordering'].includes(status)) {
        styles = "bg-red-50 text-red-700 border border-red-200";
    }
    // Purple: Intake/Dispatch
    else if (['Checked-In', 'Dispatch'].includes(status)) {
        styles = "bg-purple-50 text-purple-700 border border-purple-200";
    }
    
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${styles}`}>
            {status}
        </span>
    );
};

export default DashboardHome;