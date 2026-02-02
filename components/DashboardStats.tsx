import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { COLORS } from '../constants';

const DATA_TIMELINE = [
  { time: '08:00', signals: 12 },
  { time: '09:00', signals: 34 },
  { time: '10:00', signals: 22 },
  { time: '11:00', signals: 45 },
  { time: '12:00', signals: 18 },
  { time: '13:00', signals: 25 },
  { time: '14:00', signals: 55 }, // Incident Spike
];

const DATA_SOURCE = [
  { name: 'Teams', value: 40, color: '#6366f1' },
  { name: 'GLPI', value: 35, color: '#22c55e' },
  { name: 'Outlook', value: 15, color: '#3b82f6' },
  { name: 'System', value: 10, color: '#ef4444' },
];

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Volume Chart */}
      <div className={`${COLORS.BG_CARD} p-4 rounded-xl border border-slate-700 shadow-sm`}>
        <h4 className="text-slate-300 text-sm font-semibold mb-4">Signal Volume (24h)</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA_TIMELINE}>
              <defs>
                <linearGradient id="colorSignals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Area type="monotone" dataKey="signals" stroke="#818cf8" fillOpacity={1} fill="url(#colorSignals)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sources Distribution */}
      <div className={`${COLORS.BG_CARD} p-4 rounded-xl border border-slate-700 shadow-sm`}>
        <h4 className="text-slate-300 text-sm font-semibold mb-4">Noise Sources</h4>
        <div className="h-48 flex items-center justify-between">
           <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_SOURCE} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {DATA_SOURCE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
           
           <div className="w-1/2 pl-4 space-y-2">
             {DATA_SOURCE.map(d => (
               <div key={d.name} className="flex justify-between items-center text-xs">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                   <span className="text-slate-400">{d.name}</span>
                 </div>
                 <span className="text-slate-200 font-bold">{d.value}%</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
