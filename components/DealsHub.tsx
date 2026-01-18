import React, { useState } from 'react';
import DealList from './DealList';
import DealDesk from './DealDesk';

type DealsHubView = 'LIST' | 'DETAIL';

const DealsHub: React.FC = () => {
  const [view, setView] = useState<DealsHubView>('LIST');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const handleSelectDeal = (dealId: string) => {
    setSelectedDealId(dealId);
    setView('DETAIL');
  };

  const handleBackToList = () => {
    setView('LIST');
    setSelectedDealId(null);
  };

  return (
    <div className="h-full w-full">
        {view === 'LIST' ? (
            <DealList onSelectDeal={handleSelectDeal} />
        ) : (
            <DealDesk 
                dealId={selectedDealId || undefined} 
                onBack={handleBackToList} 
            />
        )}
    </div>
  );
};

export default DealsHub;