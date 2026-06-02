
import React from 'react';
import { NotificationItem, UserCategory } from '../types';
import { Trash2, Clock, Users, ChevronRight } from 'lucide-react';

interface NotificationListProps {
  notifications: NotificationItem[];
  onDelete: (id: string) => void;
}

const CategoryBadge: React.FC<{ category: UserCategory }> = ({ category }) => {
  const colors: Record<string, string> = {
    [UserCategory.ALL_USERS]: 'bg-blue-100 text-blue-700 border-blue-200',
    [UserCategory.FUTURES_USERS]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [UserCategory.NON_FUTURES_USERS]: 'bg-amber-100 text-amber-700 border-amber-200',
    [UserCategory.INACTIVE_FUTURES]: 'bg-stone-100 text-stone-700 border-stone-200',
    [UserCategory.ACTIVE_TRADERS]: 'bg-purple-100 text-purple-700 border-purple-200',
    [UserCategory.LEARNERS]: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const colorClass = colors[category] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
      {category}
    </span>
  );
};

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onDelete }) => {
  const grouped = notifications.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {} as Record<string, NotificationItem[]>);

  const sortedDates = Object.keys(grouped).sort();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <Users size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium">No notifications generated yet.</p>
        <p className="text-sm">Enter parameters to generate ZebPay push copy.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {sortedDates.map((date) => (
        <div key={date} className="animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xl font-extrabold text-slate-800">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped[date].map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Header/Badge area */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={item.category} />
                    <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest gap-1">
                      <Clock size={12} />
                      {item.timeSlot}
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Notification Content Preview */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-inner">
                      <span className="text-lg font-bold">Z</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate mb-0.5">{item.title}</h4>
                      <p className="text-slate-600 text-sm leading-snug line-clamp-3">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-2 bg-indigo-50/30 flex justify-between items-center text-[10px] font-medium text-slate-400">
                   <span className="font-mono">ID: {item.id.slice(0, 8)}</span>
                   <div className="flex items-center gap-1 text-indigo-600 font-bold uppercase">
                     Live Preview <ChevronRight size={10} />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
