import React from 'react';
import { NavigationProvider } from './context/NavigationContext';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <NavigationProvider>
      <Layout />
    </NavigationProvider>
  );
};

export default App;