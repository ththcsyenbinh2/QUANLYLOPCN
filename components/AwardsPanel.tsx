
import React from 'react';
import { Awards, Student } from '../types';
import { Trophy, Heart, Lightbulb, TrendingUp } from 'lucide-react';

interface AwardsPanelProps {
  awards: Awards;
  autoMode: boolean;
  onToggleAuto: (val: boolean) => void;
}

export const AwardsPanel: React.FC<AwardsPanelProps> = ({ awards, autoMode, onToggleAuto }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Khen Thưởng Tuần
        </h2>
        <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
          <input
            type="checkbox"
            checked={autoMode}
            onChange={(e) => onToggleAuto(e.target.checked)}
            className="rounded text-violet-600 focus:ring-violet-500"
          />
          Tự Động Gợi Ý
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AwardCard
          icon={<TrendingUp className="w-5 h-5 text-violet-600" />}
          title="Ngôi Sao Tiến Bộ"
          student={awards.winner}
          description="Thành tích điểm số cao nhất"
          bgColor="bg-violet-50"
          borderColor="border-violet-100"
        />
        <AwardCard
          icon={<Heart className="w-5 h-5 text-rose-500" />}
          title="Ngôi Sao Tử Tế"
          student={awards.kindness}
          description="Biết quan tâm và giúp đỡ"
          bgColor="bg-rose-50"
          borderColor="border-rose-100"
        />
        <AwardCard
          icon={<Lightbulb className="w-5 h-5 text-amber-500" />}
          title="Ngôi Sao Sáng Tạo"
          student={awards.creative}
          description="Có nhiều ý tưởng hay"
          bgColor="bg-amber-50"
          borderColor="border-amber-100"
        />
        <AwardCard
          icon={<Trophy className="w-5 h-5 text-emerald-500" />}
          title="Ngôi Sao Kiên Trì"
          student={awards.persistence}
          description="Nỗ lực vượt qua khó khăn"
          bgColor="bg-emerald-50"
          borderColor="border-emerald-100"
        />
      </div>
    </div>
  );
};

interface AwardCardProps {
  icon: React.ReactNode;
  title: string;
  student?: Student;
  description: string;
  bgColor: string;
  borderColor: string;
}

const AwardCard: React.FC<AwardCardProps> = ({ icon, title, student, description, bgColor, borderColor }) => (
  <div className={`p-4 rounded-lg border ${borderColor} ${bgColor} transition-all hover:shadow-md`}>
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-full shadow-sm">{icon}</div>
      <div>
        <h3 className="font-semibold text-zinc-800">{title}</h3>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
    </div>
    <div className="mt-3 pl-12">
      {student ? (
        <div className="text-sm font-medium text-zinc-900 bg-white/60 inline-block px-3 py-1 rounded-full border border-white/50">
          {student.name} <span className="text-zinc-400 mx-1">•</span> {student.score} điểm
        </div>
      ) : (
        <div className="text-sm text-zinc-400 italic">Chưa có ứng viên</div>
      )}
    </div>
  </div>
);
