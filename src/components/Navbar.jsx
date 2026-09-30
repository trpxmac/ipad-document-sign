import React, { useState, useEffect } from 'react';
import { Tablet, RefreshCw, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Navbar({ onResetData }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('th-TH', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="print:hidden bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Brand & Hospital Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center shrink-0">
              <img src="/siriroj-logo.svg" alt="Bangkok Hospital Siriroj" className="h-10 sm:h-12 w-auto object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  ระบบเซ็นเอกสารดิจิทัล
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  iPad Medical Station
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                โรงพยาบาลกรุงเทพสิริโรจน์ (Bangkok Hospital Siriroj)
              </p>
            </div>
          </div>

          {/* Right Status & Tools */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Tablet Status Indicator */}
            <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600">
              <Tablet className="w-4 h-4 text-blue-600 mr-2" />
              <span>Apple Pencil Ready</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ml-2 animate-pulse"></span>
            </div>

            {/* Current Time */}
            <div className="hidden sm:block text-right">
              <div className="text-xs text-slate-400">วันและเวลาปัจจุบัน</div>
              <div className="text-xs font-medium text-slate-700">{currentTime}</div>
            </div>

            {/* Reset Mock Data Button */}
            <button
              onClick={onResetData}
              title="รีเซ็ตข้อมูล Mock เอกสารทั้งหมดกลับสู่ค่าเริ่มต้น"
              className="inline-flex items-center px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 active:bg-slate-100 transition shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span className="hidden sm:inline">รีเซ็ต</span> ข้อมูล Mock
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
