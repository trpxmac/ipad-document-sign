import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Calendar, 
  Building2, 
  ArrowRight,
  PenTool,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function DocumentList({ documents, onSelectDocument, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | PENDING | SIGNED
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // Status match
      if (statusFilter !== 'ALL' && doc.status !== statusFilter) {
        return false;
      }
      // Category match
      if (categoryFilter !== 'ALL' && doc.documentCategory !== categoryFilter) {
        return false;
      }
      // Search term match
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesHN = doc.hn.toLowerCase().includes(term);
        const matchesName = doc.patientName.toLowerCase().includes(term);
        const matchesType = doc.documentType.toLowerCase().includes(term);
        const matchesDept = doc.department.toLowerCase().includes(term);
        return matchesHN || matchesName || matchesType || matchesDept;
      }
      return true;
    });
  }, [documents, statusFilter, categoryFilter, searchTerm]);

  // Statistics
  const pendingCount = documents.filter(d => d.status === 'PENDING').length;
  const signedCount = documents.filter(d => d.status === 'SIGNED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary KPI for Nurses & Doctors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setStatusFilter('PENDING')}
          className={`cursor-pointer transition p-4 sm:p-5 rounded-2xl border ${
            statusFilter === 'PENDING' 
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30' 
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">เอกสารรอเซ็นบน iPad</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-600">{pendingCount}</span>
            <span className="text-xs text-amber-700 font-medium">ฉบับรอการลงนาม</span>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('SIGNED')}
          className={`cursor-pointer transition p-4 sm:p-5 rounded-2xl border ${
            statusFilter === 'SIGNED' 
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/30' 
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">เซ็นเสร็จสมบูรณ์แล้ว</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-600">{signedCount}</span>
            <span className="text-xs text-emerald-700 font-medium">ฉบับบันทึกประวัติแล้ว</span>
          </div>
        </div>

        <div 
          onClick={() => { setStatusFilter('ALL'); setCategoryFilter('ALL'); setSearchTerm(''); }}
          className={`cursor-pointer transition p-4 sm:p-5 rounded-2xl border ${
            statusFilter === 'ALL' && categoryFilter === 'ALL' && !searchTerm
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-400/30' 
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">เอกสารทั้งหมดในรอบเวร</span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-blue-700">{documents.length}</span>
            <span className="text-xs text-blue-700 font-medium">ฉบับรวมทั้งหมด</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาด้วย HN (เช่น 67-002145), ชื่อผู้ป่วย, หรือประเภทเอกสาร..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition shrink-0 cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ทั้งหมด ({documents.length})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition shrink-0 cursor-pointer flex items-center ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-4 h-4 mr-1.5" />
              รอเซ็น ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('SIGNED')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition shrink-0 cursor-pointer flex items-center ${
                statusFilter === 'SIGNED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              เซ็นแล้ว ({signedCount})
            </button>
          </div>
        </div>

        {/* Categories Dropdown / Pills */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 pt-1 border-t border-slate-100 overflow-x-auto">
          <span className="font-semibold text-slate-400 shrink-0">หมวดเอกสาร:</span>
          {['ALL', 'COST_ESTIMATE'].map((cat) => {
            const labels = {
              ALL: 'ทุกประเภท',
              COST_ESTIMATE: 'ประเมินค่ารักษาพยาบาล'
            };
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full font-medium transition shrink-0 cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-blue-100 text-blue-700 font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {labels[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Document Items List - iPad Optimized Touch Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
            กำลังโหลดรายการเอกสารจากระบบ iMed...
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">ไม่พบเอกสารตรงกับเงื่อนไข</h3>
            <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรอง</p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isPending = doc.status === 'PENDING';
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc.id)}
                className={`group bg-white rounded-2xl border p-4 sm:p-5 transition shadow-xs hover:shadow-md cursor-pointer ${
                  isPending 
                    ? 'border-slate-200 hover:border-blue-400 hover:ring-2 hover:ring-blue-100' 
                    : 'border-slate-200 bg-slate-50/50 hover:border-emerald-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Column: Patient & Document Info */}
                  <div className="space-y-2 flex-1">
                    {/* Badges Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        HN {doc.hn}
                      </span>


                      {/* Status Badge */}
                      {isPending ? (
                        <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-1.5"></span>
                          รอลงลายมือชื่อ
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          เซ็นเสร็จสมบูรณ์
                        </span>
                      )}
                    </div>

                    {/* Patient Name & Document Type */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition flex items-center">
                        <User className="w-4 h-4 mr-2 text-slate-400" />
                        {doc.patientName} 
                        <span className="ml-2 text-xs font-normal text-slate-500">
                          ({doc.patientGender}, {doc.patientAge} ปี) • {doc.room}
                        </span>
                      </h3>
                      <p className="text-sm font-semibold text-slate-700 mt-1 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-blue-600 shrink-0" />
                        {doc.documentType}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {doc.summary}
                      </p>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        ส่งเอกสาร: {doc.createdDate}
                      </span>
                      {doc.signature && (
                        <span className="text-emerald-600 font-medium">
                          เซ็นเมื่อ: {doc.signature.signedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Action Button */}
                  <div className="sm:self-center shrink-0">
                    {isPending ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDocument(doc.id);
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-500/20 group-hover:translate-x-0.5 transition cursor-pointer"
                      >
                        <PenTool className="w-4 h-4 mr-2" />
                        เปิดเอกสารเพื่อเซ็น
                        <ChevronRight className="w-4 h-4 ml-1.5" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDocument(doc.id);
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-medium text-sm transition cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
                        ดูเอกสารที่เซ็นแล้ว
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
