
import React from 'react';
import { Student, ClassMetadata } from '../types';
import { Printer, Map as MapIcon, Shield, Heart } from 'lucide-react';

interface PrintPreviewProps {
  students: Student[];
  metadata: ClassMetadata;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ students, metadata }) => {
  const printContent = (id: string) => {
    const content = document.getElementById(id);
    if (!content) return;
    
    // Create an iframe to print
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write('<html><head><title>In Ấn</title>');
      // Inject Tailwind CDN for print styles
      doc.write('<script src="https://cdn.tailwindcss.com"></script>');
      doc.write('<style>@media print { .no-print { display: none; } body { padding: 20px; -webkit-print-color-adjust: exact; } .page-break { break-inside: avoid; page-break-inside: avoid; } }</style>');
      doc.write('</head><body>');
      doc.write(content.innerHTML);
      doc.write('</body></html>');
      doc.close();
      
      // Wait for resources to load (esp. CDN)
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      }, 1000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
          <Printer className="w-5 h-5 text-violet-600" />
          In Ấn & Xuất File
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => printContent('warrior-cards')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Shield className="w-4 h-4" /> In Phiếu
          </button>
          <button 
             onClick={() => printContent('goal-map')}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <MapIcon className="w-4 h-4" /> In Bản Đồ
          </button>
        </div>
      </div>

      <div className="border rounded-lg bg-zinc-50 p-4 overflow-hidden h-[500px] overflow-y-auto relative no-scrollbar">
        <div className="absolute top-2 right-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pointer-events-none">Chế Độ Xem Trước</div>
        
        {/* Warrior Cards Section */}
        <div id="warrior-cards" className="space-y-8">
           <div className="hidden print:block mb-6 text-center">
             <h1 className="text-2xl font-black text-violet-800 uppercase tracking-tight">Phiếu Chiến Binh Lớp Học</h1>
             <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest mt-1">{metadata.school} • {metadata.grade}</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
            {students.map((s) => (
              <div key={s.id} className="page-break bg-white border-2 border-zinc-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-zinc-800 text-white text-[10px] px-3 py-1.5 rounded-bl-xl font-black tracking-widest">
                  {s.score} ĐIỂM
                </div>
                <div className="flex items-center gap-4 mb-4 border-b border-zinc-100 pb-3">
                   <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-2xl shadow-inner border border-violet-100">🎓</div>
                   <div>
                     <div className="font-black text-xl text-zinc-800 leading-tight uppercase tracking-tighter">{s.name || 'Học Sinh'}</div>
                     <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{metadata.grade} • GV: {metadata.teacher}</div>
                   </div>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Điểm Mạnh</div>
                    <div className="bg-emerald-50 text-emerald-900 px-3 py-2 rounded-lg border border-emerald-100 font-medium">
                      {s.strength || '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Cần Cố Gắng</div>
                    <div className="bg-amber-50 text-amber-900 px-3 py-2 rounded-lg border border-amber-100 font-medium">
                      {s.challenge || '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-1">Mục Tiêu Tuần</div>
                    <div className="bg-violet-50 text-violet-900 px-3 py-2 rounded-lg border border-violet-100 italic font-semibold">
                       "{s.weeklyGoal || 'Sẽ cố gắng hết sức!'}"
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center opacity-40">
                   <span className="text-[8px] font-bold uppercase tracking-widest">Chiến Binh ETA</span>
                   <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="my-10 border-t-2 border-dashed border-zinc-200"></div>

        {/* Goal Map Section */}
        <div id="goal-map" className="bg-white p-10 rounded-xl border border-zinc-200 shadow-sm print:border-none print:shadow-none relative">
          <div className="absolute top-4 right-4 text-[10px] font-black text-violet-600 uppercase tracking-widest border border-violet-100 px-3 py-1 rounded-full">
            Bản đồ mục tiêu
          </div>
          <h2 className="text-2xl font-black text-center mb-2 uppercase tracking-tighter text-zinc-800">Bản Đồ Mục Tiêu 7 Ngày</h2>
          <p className="text-center text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-10">{metadata.school} — {metadata.grade}</p>
          
          <div className="grid grid-cols-3 gap-8">
             <div className="border border-violet-100 rounded-2xl p-6 bg-violet-50/30">
               <h3 className="font-black text-violet-800 border-b border-violet-100 pb-3 mb-4 uppercase text-xs tracking-widest">Mục Tiêu Học Tập</h3>
               <ul className="list-disc pl-5 space-y-3 text-sm text-zinc-700">
                 {students.slice(0, 8).map(s => (
                   <li key={s.id}><span className="font-bold text-violet-700">{s.name}:</span> {s.weeklyGoal || 'Học tập chăm chỉ'}</li>
                 ))}
                 {students.length > 8 && <li className="italic text-zinc-400 text-xs">...và {students.length - 8} bạn khác</li>}
               </ul>
             </div>

             <div className="border border-emerald-100 rounded-2xl p-6 bg-emerald-50/30">
               <h3 className="font-black text-emerald-800 border-b border-emerald-100 pb-3 mb-4 uppercase text-xs tracking-widest">Kỹ Năng Xã Hội</h3>
               <ul className="list-disc pl-5 space-y-3 text-sm text-zinc-700">
                  {students.slice(0, 8).map(s => (
                   <li key={s.id}><span className="font-bold text-emerald-700">{s.name}:</span> {s.strength.includes('help') || s.strength.includes('giúp') ? 'Giúp đỡ bạn' : 'Hòa đồng'}</li>
                 ))}
               </ul>
             </div>

             <div className="border border-amber-100 rounded-2xl p-6 bg-amber-50/30">
               <h3 className="font-black text-amber-800 border-b border-amber-100 pb-3 mb-4 uppercase text-xs tracking-widest">Phát Triển Bản Thân</h3>
               <ul className="list-disc pl-5 space-y-3 text-sm text-zinc-700">
                  {students.slice(0, 8).map(s => (
                   <li key={s.id}><span className="font-bold text-amber-700">{s.name}:</span> Khắc phục: {s.challenge || 'Khó khăn'}</li>
                 ))}
               </ul>
             </div>
          </div>
          <div className="mt-12 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Heart className="w-3 h-3 fill-rose-300 text-rose-300" />
            App ứng dụng quản lý lớp học THCS
          </div>
        </div>

      </div>
    </div>
  );
};
