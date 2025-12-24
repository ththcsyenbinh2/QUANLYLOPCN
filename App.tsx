
import React, { useState, useEffect } from "react";
import { ClassMetadata, Student, Awards } from './types';
import { ClassSettings } from './components/ClassSettings';
import { StudentManager } from './components/StudentManager';
import { AwardsPanel } from './components/AwardsPanel';
import { StatsPanel } from './components/StatsPanel';
import { PrintPreview } from './components/PrintPreview';
import { PresentationMode } from './components/PresentationMode';
import { LayoutDashboard, Presentation, Heart } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function App() {
  const [metadata, setMetadata] = useState<ClassMetadata>({
    school: "",
    grade: "",
    teacher: ""
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [autoAwards, setAutoAwards] = useState(true);
  const [awards, setAwards] = useState<Awards>({});
  const [isPresenting, setIsPresenting] = useState(false);

  useEffect(() => {
    if (autoAwards) {
      computeAwards();
    }
  }, [students, autoAwards]);

  const addStudent = () => {
    const newStudent: Student = {
      id: Date.now(),
      name: "",
      strength: "",
      challenge: "",
      weeklyGoal: "",
      score: 0,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (id: number, patch: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleImportFile = async (file: File) => {
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    
    if (isExcel) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      
      if (!jsonData || jsonData.length === 0) return;

      let headerIndex = -1;
      for(let i=0; i<Math.min(jsonData.length, 10); i++) {
        const row = jsonData[i].map(c => String(c).toLowerCase());
        if (row.includes("họ và tên") || row.includes("name") || row.includes("toán")) {
          headerIndex = i;
          break;
        }
      }

      const rowsToProcess = headerIndex !== -1 ? jsonData.slice(headerIndex + 1) : jsonData;
      const headerRow = headerIndex !== -1 ? jsonData[headerIndex].map(h => String(h).toLowerCase().trim()) : [];
      
      const newStudents: Student[] = [];
      
      rowsToProcess.forEach(row => {
        if (!row || row.length < 2) return;

        const getVal = (idx: number) => {
          if (idx === -1 || idx >= row.length) return "";
          return String(row[idx] || "").trim();
        };

        const getNum = (idx: number) => {
           const val = parseFloat(getVal(idx));
           return isNaN(val) ? undefined : val;
        }

        const idxName = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("tên") || h.includes("name")) : 1;
        const idxMath = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("toán")) : 2;
        const idxLit = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("văn")) : 3;
        const idxEng = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("anh")) : 4;
        const idxSci = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("GDCD")) : 5;
        const idxSci = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("KHTN")) : 6;
        const idxSci = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("KHXH")) : 7;
        const idxSci = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("Tin")) : 8;
        const idxHist = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("NT") || h.includes("Nghệ thuật")) : 9;
        const idxHist = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("GDTC") || h.includes("Thể chất")) : 10;
        const idxAvg = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("tb chung") || h.includes("average")) : 11;
        const idxStrength = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("điểm mạnh")) : 12;
        const idxChallenge = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("hạn chế")) : 13;
        const idxGoal = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("mục tiêu")) : 14;
        const idxAvatar = headerIndex !== -1 ? headerRow.findIndex(h => h.includes("ảnh") || h.includes("avatar") || h.includes("image")) : 15;

        let name = getVal(idxName);
        if (!name && headerIndex === -1) name = getVal(1);
        if (!name) return;

        const math = getNum(idxMath);
        const literature = getNum(idxLit);
        const english = getNum(idxEng);
        const science = getNum(idxSci);
        const history = getNum(idxHist);

        let scoreVal = getNum(idxAvg);
        if (scoreVal === undefined) {
           const subjects = [math, literature, english, science, history].filter(n => n !== undefined) as number[];
           if (subjects.length > 0) {
             scoreVal = subjects.reduce((a, b) => a + b, 0) / subjects.length;
             scoreVal = Math.round(scoreVal * 10) / 10;
           } else {
             scoreVal = 0;
           }
        }

        newStudents.push({
          id: Date.now() + Math.random(),
          name: name,
          score: scoreVal || 0,
          strength: getVal(idxStrength),
          challenge: getVal(idxChallenge),
          weeklyGoal: getVal(idxGoal),
          avatarUrl: getVal(idxAvatar),
          math, literature, english, science, history
        });
      });
      
      setStudents(prev => [...prev, ...newStudents]);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ["STT", "Họ và tên", "Toán", "Văn", "Anh", "GDCD", "KHTN", "KHXH", "Tin", "Nghệ thuật", "GDTC", "TB Chung", "Điểm mạnh", "Hạn chế", "Mục tiêu tuần", "Link Ảnh (Avatar)"];
    const sampleData = [
      [1, "Nguyễn Văn A", 8, 7, 9, 8, 8.5, 8.1, "Đ", "Đ", "Đ", "Hòa đồng", "Hay nói chuyện", "Hoàn thành bài tập", ""],
      [2, "Trần Thị B", 9, 9, 8.5, 9, 9, 8.9, "Đ", "Đ", "Đ", "Chăm chỉ", "Rụt rè", "Phát biểu 2 lần", ""]
    ];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    ws['!cols'] = [
      { wch: 5 }, { wch: 20 }, 
      { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, 
      { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 30 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Mau_Diem_Danh");
    XLSX.writeFile(wb, "Mau_Danh_Sach_Hoc_Sinh.xlsx");
  };

  const handleExportCSV = () => {
    const header = ["name", "score", "strength", "challenge", "weeklyGoal", "avatarUrl"];
    const rows = students.map((s) => [s.name, s.score, s.strength, s.challenge, s.weeklyGoal, s.avatarUrl].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${metadata.grade || "class"}_students.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify({ metadata, students }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${metadata.grade || "class"}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const computeAwards = () => {
    if (!students.length) {
      setAwards({});
      return;
    }
    const sortedByScore = [...students].sort((a, b) => b.score - a.score);
    const winner = sortedByScore[0];
    const kindness = students.find((s) => /kind|help|good|nice|tử tế|tốt|giúp|hòa đồng/i.test(s.strength)) || students[Math.floor(Math.random() * students.length)];
    const creative = students.find((s) => /creative|idea|smart|sáng tạo|ý tưởng|thông minh/i.test(s.strength + s.weeklyGoal)) || students[Math.floor(Math.random() * students.length)];
    const sortedByScoreAsc = [...students].sort((a, b) => a.score - b.score);
    const persistence = sortedByScoreAsc.find((s) => s.weeklyGoal.length > 5) || sortedByScoreAsc[0];
    setAwards({ winner, kindness, creative, persistence });
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 p-2 rounded-lg text-white shadow-md">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-800 leading-tight">Mô hình quản lý lớp học mẫu</h1>
              <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">TRƯỜNG TH_THCS YÊN BÌNH</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button
              onClick={() => setIsPresenting(true)}
              disabled={students.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-rose-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 hover:-translate-y-0.5"
             >
               <Presentation className="w-4 h-4" /> Trình Chiếu
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
             <ClassSettings data={metadata} onChange={(key, val) => setMetadata(prev => ({...prev, [key]: val}))} />
          </div>
          <div className="lg:col-span-1">
             <StatsPanel students={students} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 h-full">
              <StudentManager 
                students={students}
                onAdd={addStudent}
                onUpdate={updateStudent}
                onRemove={removeStudent}
                onImportFile={handleImportFile}
                onDownloadTemplate={handleDownloadTemplate}
                onExportCSV={handleExportCSV}
                onExportJSON={handleExportJSON}
              />
           </div>
           <div className="lg:col-span-1">
              <AwardsPanel awards={awards} autoMode={autoAwards} onToggleAuto={setAutoAwards} />
           </div>
        </div>

        <div>
           <PrintPreview students={students} metadata={metadata} />
        </div>
      </main>

      <footer className="mt-12 py-8 border-t border-zinc-200 text-center">
        <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm">
           <span>© 2025</span>
           <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
           <span className="font-bold text-violet-600 flex items-center gap-1.5">
             <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
             TH-THCS YÊN BÌNH
           </span>
        </div>
      </footer>

      {isPresenting && students.length > 0 && (
        <PresentationMode 
          students={students} 
          metadata={metadata}
          onClose={() => setIsPresenting(false)} 
        />
      )}
    </div>
  );
}
