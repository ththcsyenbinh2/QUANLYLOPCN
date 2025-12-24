
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Student } from '../types';
import { BarChart3 } from 'lucide-react';

interface StatsPanelProps {
  students: Student[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ students }) => {
  const distribution = [
    { range: '0-4', count: 0 },
    { range: '5-7', count: 0 },
    { range: '8-9', count: 0 },
    { range: '10', count: 0 },
  ];

  let totalScore = 0;
  
  students.forEach(s => {
    const sc = s.score;
    totalScore += sc;
    if (sc < 5) distribution[0].count++;
    else if (sc < 8) distribution[1].count++;
    else if (sc < 10) distribution[2].count++;
    else distribution[3].count++;
  });

  const avgScore = students.length ? (totalScore / students.length).toFixed(1) : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
      <h2 className="text-lg font-semibold text-zinc-800 mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-violet-600" />
        Thống Kê Lớp Học
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-violet-50 p-4 rounded-lg">
            <div className="text-xs font-semibold uppercase text-violet-500 tracking-wider">Điểm Trung Bình</div>
            <div className="text-2xl font-bold text-violet-900">{avgScore}</div>
        </div>
        <div className="bg-rose-50 p-4 rounded-lg">
            <div className="text-xs font-semibold uppercase text-rose-500 tracking-wider">Sĩ Số</div>
            <div className="text-2xl font-bold text-rose-900">{students.length}</div>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution}>
            <XAxis dataKey="range" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#8b5cf6', '#10b981'][index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
