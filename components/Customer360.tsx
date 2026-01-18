import React, { useState } from 'react';
import CustomerList from './CustomerList';
import CustomerDetail from './CustomerDetail';

type ViewState = 'LIST' | 'DETAIL';

const Customer360: React.FC = () => {
  const [view, setView] = useState<ViewState>('LIST');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setView('DETAIL');
  };

  const handleBackToList = () => {
    setView('LIST');
    setSelectedCustomerId(null);
  };

  return (
    <div className="h-full w-full">
        {view === 'LIST' ? (
            <CustomerList onSelectCustomer={handleSelectCustomer} />
        ) : (
            <CustomerDetail 
                customerId={selectedCustomerId || undefined} 
                onBack={handleBackToList} 
            />
        )}
    </div>
  );
};

export default Customer360;