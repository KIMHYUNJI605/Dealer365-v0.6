import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Tab, ViewType, UserRole } from '../types';
import { LayoutDashboard } from 'lucide-react';

interface NavigationContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  openTabs: Tab[];
  activeTabId: string;
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const DEFAULT_TAB: Tab = {
  id: 'dashboard-home',
  type: ViewType.DASHBOARD,
  title: 'Dashboard',
  icon: LayoutDashboard,
  isClosable: false,
};

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openTabs, setOpenTabs] = useState<Tab[]>([DEFAULT_TAB]);
  const [activeTabId, setActiveTabId] = useState<string>(DEFAULT_TAB.id);
  
  // New Role State
  const [userRole, setUserRole] = useState<UserRole>('MANAGER');

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const openTab = useCallback((tab: Tab) => {
    setOpenTabs(prev => {
      // Check if tab already exists by ID
      const existing = prev.find(t => t.id === tab.id);
      if (existing) {
        return prev;
      }
      return [...prev, tab];
    });
    setActiveTabId(tab.id);
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setOpenTabs(prev => {
      // Don't close the last remaining tab if it's the dashboard (optional UX rule)
      if (prev.length === 1 && prev[0].id === DEFAULT_TAB.id) return prev;

      const newTabs = prev.filter(t => t.id !== tabId);
      
      // If we closed the active tab, switch to the one before it, or the last one
      if (tabId === activeTabId && newTabs.length > 0) {
        // Find index of closed tab in old array to determine best neighbor
        const closedIndex = prev.findIndex(t => t.id === tabId);
        // Try to go left (index - 1), otherwise go to the new last index
        const newActiveIndex = Math.max(0, closedIndex - 1);
        // Ideally we pick the tab that is now at that index or close to it
        // However, simple logic: pick the last one or previous
        const newActiveTab = newTabs[Math.min(newActiveIndex, newTabs.length - 1)];
        setActiveTabId(newActiveTab.id);
      } else if (newTabs.length === 0) {
          // If all closed, restore default
          return [DEFAULT_TAB];
      }

      return newTabs;
    });
    
    // Safety check if we closed the last tab and it wasn't handled above
    if (activeTabId === tabId && openTabs.length <= 1) {
        setActiveTabId(DEFAULT_TAB.id);
    }

  }, [activeTabId, openTabs.length]);

  return (
    <NavigationContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        openTabs,
        activeTabId,
        openTab,
        closeTab,
        setActiveTab: setActiveTabId,
        userRole,
        setUserRole
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};