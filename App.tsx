import React, { useState, useEffect } from 'react';
import { GenerateParams, NotificationItem } from './types';
import { generateNotifications } from './services/geminiService';
import { exportToExcel } from './utils/excel';
import Generator from './components/Generator';
import NotificationList from './components/NotificationList';
import { BellRing, Download, Trash } from 'lucide-react';

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('pushGenieData');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('pushGenieData', JSON.stringify(notifications));
  }, [notifications]);

  const handleGenerate = async (params: GenerateParams) => {
    setIsLoading(true);
    try {
      const generatedData = await generateNotifications(params);
      
      const newItems: NotificationItem[] = generatedData.map((item: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        date: params.date,
        category: params.category,
        title: item.title,
        body: item.body,
        timeSlot: item.timeSlot
      }));

      setNotifications(prev => [...prev, ...newItems]);
    } catch (error) {
      alert("Failed to generate notifications. Please check your API configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      setNotifications([]);
    }
  };

  const handleExport = () => {
    exportToExcel(notifications);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BellRing className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ZebPay Push Manager</h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="text-slate-500 hover:text-red-600 font-medium text-sm px-3 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Trash size={16} />
              Clear All
            </button>
            <button
              onClick={handleExport}
              disabled={notifications.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Download size={16} />
              Export Excel
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Generator */}
          <div className="md:col-span-4 lg:col-span-3">
            <Generator onGenerate={handleGenerate} isLoading={isLoading} />
            
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-800">
              <p className="font-semibold mb-1">ZebPay Growth Tip:</p>
              <p>For high conversion, use "FOMO" tone when the market is volatile (e.g. "BTC Breaking 70k").</p>
            </div>
          </div>

          {/* Right Content: List */}
          <div className="md:col-span-8 lg:col-span-9">
             <NotificationList notifications={notifications} onDelete={handleDelete} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;