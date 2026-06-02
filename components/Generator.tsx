
import React, { useState } from 'react';
import { GenerateParams, UserCategory } from '../types';
import { Loader2, Sparkles, CalendarDays } from 'lucide-react';

interface GeneratorProps {
  onGenerate: (params: GenerateParams) => Promise<void>;
  isLoading: boolean;
}

const Generator: React.FC<GeneratorProps> = ({ onGenerate, isLoading }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<UserCategory>(UserCategory.ALL_USERS);
  const [count, setCount] = useState<number>(3);
  const [tone, setTone] = useState<string>('Urgent & Exciting');
  const [topic, setTopic] = useState<string>('ZebPay Futures Signals');
  const [occasion, setOccasion] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ date, category, count, tone, topic, occasion });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
          <Sparkles size={20} />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">AI Copywriter</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Occasion / Holiday (Optional)</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="e.g. New Year, Diwali, Monday Motivation"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Segment</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as UserCategory)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-slate-50"
          >
            {Object.values(UserCategory).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            >
              <option>Urgent & Exciting</option>
              <option>Professional</option>
              <option>FOMO</option>
              <option>Educational</option>
              <option>Community</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              max="10"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Context / Market Trend</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Bitcoin Rally, Market Dip..."
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
            isLoading 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Generating Signals...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Copy
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Generator;
