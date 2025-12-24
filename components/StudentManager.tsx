
import React, { useRef } from 'react';
import { Student } from '../types';
import { Trash2, Plus, Upload, Download, FileJson, FileSpreadsheet, Image as ImageIcon, Camera } from 'lucide-react';

interface StudentManagerProps {
  students: Student[];
  onAdd: () => void;
  onUpdate: (id: number, patch: Partial<Student>) => void;
  onRemove: (id: number) => void;
  onImportFile: (file: File) => void;
  onDownloadTemplate: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  onAdd,
  onUpdate,
  onRemove,
  onImportFile,
  onDownloadTemplate,
  onExportCSV,
  onExportJSON,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
      e.target.value = ''; // Reset
    }
  };

  const handleAvatarUpload = (studentId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpdate(studentId, { avatarUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col h-full">
      <div className="p-6 border-b border-zinc-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-800">Danh Sách Học Sinh</h2>
            <p className="text-sm text-zinc-500">Sĩ số: {students.length} em</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
              title="Xuất dữ liệu ra file CSV"
            >
              <Download className="w-3.5 h-3.5" /> Xuất CSV
            </button>
            <button
              onClick={onExportJSON}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
              title="Xuất dữ liệu dự phòng JSON"
            >
              <FileJson className="w-3.5 h-3.5" /> Xuất JSON
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
           <button
            onClick={onAdd}
            className="flex items-center justify-center gap-3 px-4 py-4 bg-white border-2 border-dashed border-violet-200 hover:border-violet-400 text-violet-600 hover:bg-violet-50 rounded-xl transition-all group"
          >
            <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-left">
               <div className="text-xs font-bold uppercase tracking-wider opacity-70">Bước 1</div>
               <div className="font-semibold text-sm">Thêm HS Thủ Công</div>
            </div>
          </button>

           <button
            onClick={onDownloadTemplate}
            className="flex items-center justify-center gap-3 px-4 py-4 bg-white border-2 border-dashed border-rose-200 hover:border-rose-400 text-rose-600 hover:bg-rose-50 rounded-xl transition-all group"
          >
             <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="text-left">
               <div className="text-xs font-bold uppercase tracking-wider opacity-70">Bước 2</div>
               <div className="font-semibold text-sm">Tải Mẫu Excel</div>
            </div>
          </button>

           <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-3 px-4 py-4 bg-white border-2 border-dashed border-purple-200 hover:border-purple-400 text-purple-600 hover:bg-purple-50 rounded-xl transition-all group"
          >
             <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-left">
               <div className="text-xs font-bold uppercase tracking-wider opacity-70">Bước 3</div>
               <div className="font-semibold text-sm">Tải Lên Excel</div>
            </div>
          </button>
        </div>
        
        <input
            ref={fileInputRef}
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            className="hidden"
            onChange={handleFileChange}
          />
      </div>

      <div className="overflow-auto max-h-[600px] p-0 flex-1">
        {students.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 flex flex-col items-center justify-center h-64">
            <UsersPlaceholder />
            <p className="mt-4 font-medium text-zinc-500">Lớp học chưa có dữ liệu</p>
            <p className="text-sm mt-1 text-zinc-400">Hãy chọn một trong 3 cách trên để bắt đầu</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b">Họ Tên / Ảnh</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b">Thông Tin Chi Tiết</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b w-16 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-violet-50/30 group transition-colors">
                  <td className="p-4 align-top w-1/4 min-w-[200px]">
                    <div className="flex gap-3 mb-2">
                       <div className="relative group/avatar">
                         <div className="w-16 h-16 rounded-xl bg-zinc-100 flex-shrink-0 overflow-hidden border border-zinc-200 flex items-center justify-center shadow-sm">
                            {student.avatarUrl ? (
                              <img src={student.avatarUrl} alt="avt" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-zinc-300" />
                            )}
                         </div>
                         <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer rounded-xl">
                            <Camera className="w-5 h-5 text-white" />
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleAvatarUpload(student.id, e)}
                            />
                         </label>
                       </div>

                       <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={student.name}
                            onChange={(e) => onUpdate(student.id, { name: e.target.value })}
                            placeholder="Họ tên học sinh"
                            className="w-full font-bold text-zinc-700 bg-transparent border-b border-transparent focus:border-violet-500 focus:ring-0 px-0 py-0 transition-colors placeholder:font-normal"
                          />
                          <div className="flex items-center gap-2">
                             <div className="text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded cursor-help">
                               {student.avatarUrl ? 'Đã có ảnh' : 'Chưa có ảnh'}
                             </div>
                             <input
                                type="text"
                                value={student.avatarUrl || ''}
                                onChange={(e) => onUpdate(student.id, { avatarUrl: e.target.value })}
                                placeholder="Hoặc dán link ảnh..."
                                className="flex-1 text-[10px] text-zinc-500 bg-zinc-50 rounded border border-transparent hover:border-zinc-200 focus:border-violet-300 focus:bg-white px-2 py-0.5 outline-none transition-all"
                              />
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Điểm TB</span>
                      <input
                        type="number"
                        value={student.score}
                        onChange={(e) => onUpdate(student.id, { score: Number(e.target.value) })}
                        className="w-16 bg-zinc-100 rounded px-2 py-1 text-sm font-mono font-bold text-violet-600 text-center focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </td>
                  <td className="p-4 align-top space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Điểm Mạnh</label>
                         <input
                            value={student.strength}
                            onChange={(e) => onUpdate(student.id, { strength: e.target.value })}
                            placeholder="VD: Giúp đỡ bạn bè"
                            className="w-full text-sm border border-zinc-200 rounded px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                          />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Hạn Chế</label>
                         <input
                            value={student.challenge}
                            onChange={(e) => onUpdate(student.id, { challenge: e.target.value })}
                            placeholder="VD: Nói chuyện riêng"
                            className="w-full text-sm border border-zinc-200 rounded px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                          />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">Mục Tiêu Tuần</label>
                         <input
                            value={student.weeklyGoal}
                            onChange={(e) => onUpdate(student.id, { weeklyGoal: e.target.value })}
                            placeholder="VD: Hoàn thành bài tập"
                            className="w-full text-sm border border-zinc-200 rounded px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
                          />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle text-center">
                    <button
                      onClick={() => onRemove(student.id)}
                      className="text-zinc-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Xóa học sinh"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const UsersPlaceholder = () => (
  <svg className="w-16 h-16 mx-auto text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
