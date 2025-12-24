
import React, { useState, useEffect, useRef } from 'react';
import { Student, ClassMetadata } from '../types';
import { X, ChevronLeft, ChevronRight, Sparkles, Quote, Target, TrendingUp, AlertCircle, Medal, Star, PenTool, FileDown, Heart } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

interface PresentationModeProps {
  students: Student[];
  metadata: ClassMetadata;
  onClose: () => void;
}

const IMAGES = {
  rocket: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png",
  heart: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Sparkling%20Heart.png",
  bulb: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png",
  biceps: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Flexed%20Biceps.png",
  trophy: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Trophy.png",
  books: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Books.png",
  star: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Star.png"
};

export const PresentationMode: React.FC<PresentationModeProps> = ({ students, metadata, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aiComment, setAiComment] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const student = students[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  useEffect(() => {
    setAiComment("");
  }, [currentIndex]);

  const nextSlide = () => {
    if (currentIndex < students.length - 1) setCurrentIndex(c => c + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(c => c - 1);
  };

  const generateAiComment = async () => {
    if (!process.env.API_KEY) {
      setAiComment("Vui lòng cấu hình API_KEY để sử dụng tính năng này.");
      return;
    }

    setLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Bạn là giáo viên chủ nhiệm THCS. 
      Viết "Lời nhắn gửi phụ huynh" (khoảng 40-50 từ) cho học sinh: ${student.name}.
      Thông tin:
      - Điểm TB: ${student.score}
      - Môn học: Toán (${student.math || '?'}), Văn (${student.literature || '?'}), Anh (${student.english || '?'}).
      - Điểm mạnh: ${student.strength}
      - Cần cố gắng: ${student.challenge}
      
      Giọng văn: Trang trọng, ấm áp, tin tưởng, nhấn mạnh sự phối hợp giữa gia đình và nhà trường.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      setAiComment(response.text || "Không thể tạo nhận xét lúc này.");
    } catch (error) {
      console.error(error);
      setAiComment("Lỗi kết nối AI. Vui lòng thử lại.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const cleanName = student.name.replace(/\s+/g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      pdf.save(`Phieu_Chien_Binh_${cleanName}.pdf`);

    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!student) return null;

  const awardsList = [];
  if (student.score >= 9) {
    awardsList.push({ 
      name: "Ngôi Sao Tiến Bộ", 
      image: IMAGES.rocket,
      gradient: "from-violet-50 to-purple-100",
      border: "border-violet-200",
      text: "text-violet-700",
      animation: "animate-rocket-fly" 
    });
  }

  if (student.strength.toLowerCase().includes("giúp") || student.strength.toLowerCase().includes("hòa đồng") || student.strength.toLowerCase().includes("tốt") || student.strength.toLowerCase().includes("ngoan")) {
    awardsList.push({ 
      name: "Ngôi Sao Tử Tế", 
      image: IMAGES.heart,
      gradient: "from-rose-50 to-pink-100",
      border: "border-rose-200",
      text: "text-rose-700",
      animation: "animate-heart-pulse"
    });
  }

  if (student.strength.toLowerCase().includes("sáng tạo") || student.weeklyGoal.toLowerCase().includes("ý tưởng") || student.strength.toLowerCase().includes("thông minh")) {
    awardsList.push({ 
      name: "Ngôi Sao Sáng Tạo", 
      image: IMAGES.bulb,
      gradient: "from-amber-50 to-yellow-100",
      border: "border-amber-200",
      text: "text-amber-700",
      animation: "animate-bulb-swing"
    });
  }

  if (awardsList.length === 0 || student.strength.toLowerCase().includes("cố gắng") || student.strength.toLowerCase().includes("nỗ lực") || student.strength.toLowerCase().includes("chăm")) {
    awardsList.push({ 
      name: "Ngôi Sao Kiên Trì", 
      image: IMAGES.biceps,
      gradient: "from-emerald-50 to-green-100",
      border: "border-emerald-200",
      text: "text-emerald-700",
      animation: "animate-biceps-flex"
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex items-center justify-center overflow-hidden font-sans">
      <style>
        {`
          @keyframes rocket-fly {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(1px, -3px) rotate(2deg); }
            50% { transform: translate(0px, -5px) rotate(0deg); }
            75% { transform: translate(-1px, -3px) rotate(-2deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes heart-pulse {
            0%, 100% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.08); filter: brightness(1.1); }
          }
          @keyframes bulb-swing {
            0%, 100% { transform: rotate(-6deg); }
            50% { transform: rotate(6deg); }
          }
          @keyframes biceps-flex {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(-4deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes gradient-bg {
             0% { background-position: 0% 50%; }
             50% { background-position: 100% 50%; }
             100% { background-position: 0% 50%; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-rocket-fly { animation: rocket-fly 4s ease-in-out infinite; }
          .animate-heart-pulse { animation: heart-pulse 2.5s ease-in-out infinite; }
          .animate-bulb-swing { animation: bulb-swing 3s ease-in-out infinite; }
          .animate-biceps-flex { animation: biceps-flex 2s ease-in-out infinite; }
          .animate-float { animation: float-slow 4s ease-in-out infinite; }
          .animate-spin-slow { animation: spin-slow 15s linear infinite; }
          .animate-gradient { background-size: 200% 200%; animation: gradient-bg 15s ease infinite; }
          .font-times { font-family: "Times New Roman", Times, serif; }
          .img-3d { filter: drop-shadow(0 8px 12px rgba(0,0,0,0.2)); backface-visibility: hidden; transform-style: preserve-3d; }
        `}
      </style>

      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-rose-900 to-zinc-950 animate-gradient"></div>

      <div className="absolute top-6 right-6 z-50 flex gap-3">
         <button 
           onClick={handleDownloadPDF}
           disabled={isDownloading}
           className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-rose-500/40 transition-all border border-white/20 transform hover:scale-105 active:scale-95"
         >
           {isDownloading ? <span className="animate-spin">⏳</span> : <FileDown className="w-5 h-5" />}
           <span>{isDownloading ? 'Đang tạo PDF...' : 'Tải PDF'}</span>
         </button>
         <button onClick={onClose} className="bg-white/10 hover:bg-red-500/90 text-white p-2.5 rounded-full backdrop-blur-md transition-all border border-white/20 shadow-xl">
            <X className="w-6 h-6" />
         </button>
      </div>

      <button onClick={prevSlide} disabled={currentIndex === 0} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white hover:bg-white/10 p-4 rounded-full disabled:opacity-0 transition-all z-50 group">
        <ChevronLeft className="w-16 h-16 group-hover:-translate-x-1 transition-transform" />
      </button>

      <button onClick={nextSlide} disabled={currentIndex === students.length - 1} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white hover:bg-white/10 p-4 rounded-full disabled:opacity-0 transition-all z-50 group">
        <ChevronRight className="w-16 h-16 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="relative h-[85vh] aspect-[1.414/1] bg-white/20 p-1 rounded-[24px] shadow-2xl flex items-center justify-center">
        <div ref={cardRef} className="bg-white w-full h-full rounded-2xl overflow-hidden flex shadow-inner relative border-[12px] border-white">
          <div className="absolute inset-0 border-2 border-violet-50 rounded-lg pointer-events-none z-0"></div>

          <div className="w-[32%] bg-gradient-to-b from-zinc-50 to-violet-50/40 border-r border-zinc-200 flex flex-col p-6 relative z-10">
             <div className="text-center pb-4 border-b border-violet-100 mb-5">
                 <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">TRƯỜNG TIỂU HỌC - THCS</div>
                 <div className="text-sm font-black text-violet-800 uppercase tracking-tight leading-tight">{metadata.school || 'TÊN TRƯỜNG'}</div>
             </div>

             <div className="text-center mb-6 relative">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-violet-50 bg-white flex items-center justify-center">
                   {student.avatarUrl ? (
                     <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-br from-violet-500 to-rose-600 flex items-center justify-center text-white text-5xl font-black">
                       {student.name.charAt(0)}
                     </div>
                   )}
                </div>
                <h1 className="text-2xl font-black text-zinc-800 leading-tight mb-1">{student.name}</h1>
                <div className="text-sm font-bold text-zinc-500">Lớp: {metadata.grade}</div>
             </div>

             <div className="bg-white rounded-2xl p-5 shadow-lg shadow-violet-100/40 border border-zinc-100 flex-1 flex flex-col relative overflow-hidden">
               <div className="absolute -right-6 -top-6 opacity-10">
                 <img src={IMAGES.books} alt="books" className="w-24 h-24 img-3d" />
               </div>
               
               <div className="flex items-center gap-2 mb-4 text-violet-700 font-bold border-b border-violet-50 pb-2 relative z-10">
                  <Medal className="w-5 h-5" />
                  <span className="text-sm tracking-tight">BẢNG ĐIỂM CHIẾN BINH</span>
               </div>
               
               <div className="space-y-4 flex-1 relative z-10">
                  <ScoreRow label="Toán" score={student.math} color="bg-violet-500" />
                  <ScoreRow label="Tiếng Việt" score={student.literature} color="bg-rose-500" />
                  <ScoreRow label="Tiếng Anh" score={student.english} color="bg-amber-500" />
                  <ScoreRow label="Khoa học" score={student.science} color="bg-emerald-500" />
               </div>

               <div className="mt-auto pt-4 border-t border-zinc-100">
                 <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Điểm TB</span>
                    <span className="text-4xl font-black text-violet-600 leading-none">{student.score}</span>
                 </div>
               </div>
             </div>
          </div>

          <div className="w-[68%] p-8 bg-white relative z-10 flex flex-col h-full">
             <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-black text-zinc-800 tracking-tighter mb-1 uppercase">PHIẾU CHIẾN BINH</h2>
                  <p className="text-violet-500 text-xs font-bold uppercase tracking-widest">THCS YÊN BÌNH</p>
                </div>
                <div className="bg-amber-100 p-2.5 rounded-full shadow-inner">
                   <Star className="w-8 h-8 text-amber-500 fill-amber-500 animate-spin-slow" />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-emerald-50/40 rounded-2xl p-5 border border-emerald-100 relative overflow-hidden">
                   <h3 className="flex items-center gap-2 text-emerald-700 font-bold uppercase text-[10px] tracking-widest mb-2 relative z-10">
                     <TrendingUp className="w-4 h-4" /> Điểm Mạnh
                   </h3>
                   <p className="text-zinc-800 font-bold text-lg leading-snug relative z-10">{student.strength || "—"}</p>
                </div>
                <div className="bg-rose-50/40 rounded-2xl p-5 border border-rose-100 relative overflow-hidden">
                   <h3 className="flex items-center gap-2 text-rose-700 font-bold uppercase text-[10px] tracking-widest mb-2 relative z-10">
                     <AlertCircle className="w-4 h-4" /> Cần Cố Gắng
                   </h3>
                   <p className="text-zinc-800 font-bold text-lg leading-snug relative z-10">{student.challenge || "—"}</p>
                </div>
             </div>

             <div className="bg-violet-50/60 rounded-2xl p-6 border border-violet-100 mb-6 flex items-center gap-6 relative overflow-hidden">
                <div className="relative z-10 w-full">
                  <h3 className="text-violet-800 font-bold uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Mục Tiêu Tuần Tới
                  </h3>
                  <div className="text-zinc-800 text-2xl font-black italic border-l-4 border-rose-400 pl-5 py-1">
                    "{student.weeklyGoal || 'Luôn cố gắng hết sức mình!'}"
                  </div>
                </div>
             </div>

             <div className="mb-6 flex-1 relative">
                <div className="absolute right-0 top-[-15px] w-24 h-24 animate-float pointer-events-none z-20">
                    <img src={IMAGES.trophy} alt="Trophy" className="w-full h-full img-3d" />
                </div>

                <h3 className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-4 border-b border-zinc-100 pb-2">DANH HIỆU VINH DANH</h3>
                <div className="flex flex-wrap gap-5">
                   {awardsList.map((award, i) => (
                      <div key={i} className={`group/award relative flex items-center gap-4 pr-7 pl-2 py-4 bg-gradient-to-r ${award.gradient} border ${award.border} rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-default overflow-visible`}>
                         <div className={`relative w-16 h-16 -ml-5 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white z-20`}>
                            <img src={award.image} alt={award.name} className={`w-14 h-14 object-contain img-3d ${award.animation}`} />
                         </div>
                         <span className={`relative font-black ${award.text} text-base z-10 tracking-tighter uppercase`}>{award.name}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="mt-auto relative group">
                <div className="relative z-10 bg-white rounded-2xl border border-zinc-200 shadow-lg p-0 overflow-hidden ring-4 ring-zinc-50/50">
                   <div className="bg-gradient-to-r from-amber-50 to-white px-5 py-3 border-b border-amber-100 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-amber-700">
                         <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600 shadow-inner"><PenTool className="w-3.5 h-3.5" /></div>
                         <span className="text-[10px] font-bold uppercase tracking-widest">Lời Nhắn Của Giáo Viên</span>
                      </div>
                      {!aiComment && (
                         <button
                            onClick={generateAiComment}
                            disabled={loadingAi}
                            className="flex items-center gap-2 px-4 py-1.5 bg-white border border-violet-100 text-violet-700 rounded-full text-[10px] font-black shadow-sm hover:bg-violet-50 hover:scale-105 active:scale-95 transition-all"
                         >
                            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                            {loadingAi ? 'ĐANG VIẾT...' : 'DÙNG AI GỢI Ý'}
                         </button>
                      )}
                   </div>

                   <div className="p-6 bg-white relative min-h-[150px]">
                       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000000 1px, transparent 1px)', backgroundSize: '100% 32px', marginTop: '22px' }}></div>
                       <Quote className="absolute top-3 left-3 w-5 h-5 text-amber-200 opacity-40" />
                       <p className="text-zinc-800 text-lg font-times italic leading-8 relative z-10">
                         {aiComment || (loadingAi ? "AI đang suy nghĩ lời nhắn ấm áp nhất..." : <span className="text-zinc-300">Nhấn nút "AI Gợi Ý" để nhận lời khuyên từ AI...</span>)}
                       </p>
                   </div>

                   <div className="px-5 py-2.5 bg-zinc-50 border-t border-zinc-100 flex justify-end items-center gap-4">
                      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Ký tên giáo viên</div>
                      <div className="font-times font-black text-violet-900 text-lg italic border-b-2 border-violet-100 px-4 min-w-[140px] text-center">
                         {metadata.teacher || ''}
                      </div>
                   </div>
                </div>
             </div>

          </div>
        </div>

      </div>
      
      <div className="absolute bottom-6 flex flex-col items-center gap-1">
         <div className="text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase">
            Học sinh {currentIndex + 1} / {students.length} • Mô hình quản lý lớp học mẫu
         </div>
         <div className="text-rose-400 text-[10px] font-bold tracking-[0.1em] uppercase flex items-center gap-1.5">
            <Heart className="w-3 h-3 fill-rose-400" />
            TRƯỜNG TH-THCS YÊN BÌNH
         </div>
      </div>
    </div>
  );
};

const ScoreRow = ({ label, score, color }: { label: string, score?: number, color: string }) => (
  <div className="flex items-center justify-between group py-0.5">
    <span className="text-zinc-500 font-bold text-xs uppercase tracking-tight w-24">{label}</span>
    <div className="flex-1 flex items-center gap-3">
       <div className="flex-1 h-2.5 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
          <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${(score || 0) * 10}%` }}></div>
       </div>
       <span className="font-black text-zinc-700 w-8 text-right text-sm">{score !== undefined ? score : '-'}</span>
    </div>
  </div>
);
