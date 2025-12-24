
import React from 'react';
import { ClassMetadata } from '../types';
import { School, Users, User } from 'lucide-react';

interface ClassSettingsProps {
  data: ClassMetadata;
  onChange: (key: keyof ClassMetadata, value: string) => void;
}

export const ClassSettings: React.FC<ClassSettingsProps> = ({ data, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
      <h2 className="text-lg font-semibold text-zinc-800 mb-4 flex items-center gap-2">
        <School className="w-5 h-5 text-violet-600" />
        Thông Tin Lớp Học
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500">Tên Trường</label>
          <div className="relative">
            <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
              placeholder="VD: THCS Yên Bình"
              value={data.school}
              onChange={(e) => onChange('school', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500">Lớp / Khối</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
              placeholder="VD: 8A"
              value={data.grade}
              onChange={(e) => onChange('grade', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500">Giáo Viên Chủ Nhiệm</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
              placeholder="VD: Cô Nguyễn Thị Lan Anh"
              value={data.teacher}
              onChange={(e) => onChange('teacher', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
