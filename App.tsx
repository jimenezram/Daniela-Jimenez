
import React, { useState } from 'react';
import PricingTable from './components/PricingTable';
import ImageEditor from './components/ImageEditor';
import ImageGenerator from './components/ImageGenerator';

type Tab = 'pricing' | 'editor' | 'generator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('pricing');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pricing':
        return <PricingTable />;
      case 'editor':
        return <ImageEditor />;
      case 'generator':
        return <ImageGenerator />;
      default:
        return <PricingTable />;
    }
  };

  const TabButton = ({ tab, label }: { tab: Tab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === tab
          ? 'bg-violet-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-violet-700">AI Fitness & Image Studio</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <TabButton tab="pricing" label="Planes" />
            <TabButton tab="editor" label="Editor de Imagen" />
            <TabButton tab="generator" label="Generador de Imagen" />
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {renderTabContent()}
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by React, Tailwind CSS, and Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
