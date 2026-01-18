import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import DispatchBoard from './DispatchBoard';
import TechnicianView from './TechnicianView';
import SalesShowroom from './SalesShowroom';
import DealDesk from './DealDesk';
import DealsHub from './DealsHub';
import QuoteList from './QuoteList';
import CRMLeads from './CRMLeads';
import Customer360 from './Customer360';
import CustomerDetail from './CustomerDetail';
import TaskCalendar from './TaskCalendar';
import AIAssistant from './AIAssistant';
import { useNavigation } from '../context/NavigationContext';
import { ViewType } from '../types';
import { FileText } from 'lucide-react';

const Layout: React.FC = () => {
  const { activeTabId, openTabs } = useNavigation();

  // Find the active tab object
  const activeTab = openTabs.find(tab => tab.id === activeTabId);

  // Simple factory to render content based on ViewType
  const renderContent = () => {
    if (!activeTab) return <div className="p-10 text-center text-gray-500">No active tab</div>;

    switch (activeTab.type) {
      case ViewType.DASHBOARD:
        // DashboardHome now handles role-based rendering internally
        return <DashboardHome />;
        
      case ViewType.RO_DETAIL:
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center space-y-4 mt-10">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2">
                        <FileText size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Repair Order Detail</h2>
                    <p className="text-gray-500">Viewing Data for <span className="font-mono font-medium text-black">{activeTab.data?.roId || activeTab.title}</span></p>
                    <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded text-sm border border-yellow-200 mt-4">
                        Full detail view to be implemented in Step 4.
                    </div>
                </div>
            </div>
        );
      case ViewType.CRM:
        return <CRMLeads />;
      case ViewType.CUSTOMER_360:
        return <Customer360 />; // The List View
      case ViewType.CUSTOMER_DETAIL:
        return <CustomerDetail />; // The Specific Profile (James Bond)
      case ViewType.CALENDAR:
        return <TaskCalendar />;
      case ViewType.SALES:
        return <SalesShowroom />;
      case ViewType.DEAL_DESK:
        return <DealsHub />; // The Hub Controller (List <-> Detail)
      case ViewType.DEAL_EDITOR:
        return <DealDesk />; // The Standalone Editor (from Configurator)
      case ViewType.SERVICE:
        return <DispatchBoard />;
      case ViewType.TECH_VIEW:
        return <TechnicianView />;
      case ViewType.REPORTS:
        return <PlaceholderView title="Reporting Suite" color="bg-indigo-50" />;
      case ViewType.ADMIN:
        return <PlaceholderView title="Admin Settings" color="bg-slate-50" />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            Work in Progress: {activeTab.title}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA]">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-0 relative">
          {renderContent()}
        </main>
        {/* Global Floating AI Assistant */}
        <AIAssistant />
      </div>
    </div>
  );
};

// Simple placeholder for non-implemented views to demonstrate routing
const PlaceholderView = ({ title, color }: { title: string, color: string }) => (
  <div className={`h-full w-full p-8 ${color} flex flex-col items-center justify-center`}>
    <h2 className="text-3xl font-bold text-gray-800 opacity-20">{title}</h2>
    <p className="text-gray-500 mt-4 max-w-md text-center">
      This module is initialized in the workspace tab system. 
      Select "Dashboard" to view the completed home view.
    </p>
  </div>
);

export default Layout;