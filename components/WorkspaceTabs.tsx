import React, { useRef, useEffect } from 'react';
import { X, File } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

const WorkspaceTabs: React.FC = () => {
  const { openTabs, activeTabId, setActiveTab, closeTab } = useNavigation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (scrollContainerRef.current) {
        const activeElement = scrollContainerRef.current.querySelector(`[data-tab-id="${activeTabId}"]`);
        if (activeElement) {
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    }
  }, [activeTabId]);

  return (
    <div className="flex w-full bg-[#F3F4F6] border-b border-gray-200 h-9 overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar items-end w-full"
        style={{ scrollbarWidth: 'none' }} // Firefox hide scrollbar
      >
        {openTabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const Icon = tab.icon || File;

          return (
            <div
              key={tab.id}
              data-tab-id={tab.id}
              className={`
                group flex items-center min-w-[140px] max-w-[200px] h-full px-3 py-1 cursor-pointer select-none text-xs border-r border-gray-200
                transition-colors duration-100 ease-in-out
                ${isActive ? 'bg-white text-[#1A1A1A] font-medium border-t-2 border-t-[#1A1A1A]' : 'bg-[#E5E7EB] text-[#5E5E5E] hover:bg-[#EEF2FF]'}
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={14} className={`mr-2 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className="truncate flex-1">{tab.title}</span>
              
              {tab.isClosable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className={`
                    ml-2 p-0.5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-opacity
                    ${isActive ? 'opacity-100' : ''}
                  `}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkspaceTabs;
