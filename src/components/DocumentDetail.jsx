import React, { useState } from 'react';
import { 
  ArrowLeft, 
  PenTool, 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar, 
  Building2, 
  FileText, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Info,
  Check
} from 'lucide-react';
import SignatureModal from './SignatureModal';

export default function DocumentDetail({ document, onBack, onSaveSignature }) {
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  if (!document) return null;

  const isPending = document.status === 'PENDING';

  const handleConfirmSignature = async (payload) => {
    await onSaveSignature(payload);
    setIsSignModalOpen(false);
    setToastMessage('บันทึกลายเซ็นดิจิทัลและอัปเดตสถานะสำเร็จ!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium text-sm transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับไปหน้ารายการเอกสาร
        </button>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {isPending ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3.5 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                รอการลงนาม
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                ลงนามเสร็จสมบูรณ์แล้ว
              </span>
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium text-sm transition cursor-pointer"
              >
                <Printer className="w-4 h-4 mr-1.5 text-slate-500" />
                พิมพ์ / พรีวิว PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Patient Information Banner (Hospital Style) */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-500/30 text-blue-200 font-mono text-xs font-bold px-2.5 py-0.5 rounded border border-blue-400/30">
                HN: {document.hn}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight pt-1">
              {document.patientName}
            </h2>
            <p className="text-xs text-slate-300">
              เพศ: {document.patientGender} • อายุ: {document.patientAge} ปี • บัตร ปชช/Passport: {document.idCard}
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-xs space-y-1 shrink-0">
            <div className="text-slate-300">รหัสเอกสาร:</div>
            <div className="font-semibold text-white">{document.id}</div>
          </div>
        </div>
      </div>

      {/* PDF-like Formal Document Container (A4 Paper Aesthetic) */}
      <div className="bg-white rounded-3xl paper-shadow border border-slate-200 p-6 sm:p-12 space-y-8">
        {/* Hospital Document Letterhead */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-black text-2xl shadow-inner">
              BSI
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900">
                โรงพยาบาลกรุงเทพสิริโรจน์ (Bangkok Hospital Siriroj)
              </div>
              <div className="text-xs text-slate-500">
                44 ถนนเฉลิมพระเกียรติ ร.9 ต.วิชิต อ.เมืองภูเก็ต จ.ภูเก็ต 83000 • โทร. 076-361-888
              </div>
              <div className="text-[11px] text-slate-400">
                เครือข่ายบริษัท กรุงเทพดุสิตเวชการ จำกัด (มหาชน) - BDMS
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 hidden sm:block">
            <div className="font-bold text-slate-800">iMed Electronic Consent Record</div>
            <div>วันที่เอกสาร: {document.createdDate}</div>
            <div className="font-mono text-[11px] text-slate-400">Doc Ref: {document.id}</div>
          </div>
        </div>

        {/* Document Title Header */}
        <div className="text-center space-y-1 py-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {document.content?.title || document.documentType}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            (หนังสือยินยอมและข้อตกลงการเข้ารับการบริบาลทางการแพทย์ตามมาตรฐาน JCI)
          </p>
        </div>

        {/* Summary Pill */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs sm:text-sm text-slate-700 flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-slate-800">สรุปแผนการรักษา: </span>
            {document.summary}
          </div>
        </div>

        {/* Legal & Medical Clauses Sections */}
        <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          {document.content?.sections?.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {section.heading}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base text-justify pl-1">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Signatures & Execution Section (The Core of iPad App) */}
        <div className="pt-8 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. Patient / Representative Signature Box */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  ลายมือชื่อผู้ป่วย หรือ ผู้แทนโดยชอบธรรม
                </div>

                {isPending ? (
                  // Pending state - clickable prompt for iPad
                  <div
                    onClick={() => setIsSignModalOpen(true)}
                    className="border-2 border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-100/60 rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center my-3"
                  >
                    <PenTool className="w-8 h-8 text-blue-600 mb-2 animate-bounce" />
                    <span className="text-sm font-bold text-blue-800">แตะที่นี่เพื่อลงลายมือชื่อ</span>
                    <span className="text-xs text-blue-600 mt-0.5">รองรับ Apple Pencil และการทัชบน iPad</span>
                  </div>
                ) : (
                  // Signed State - Display Real Signature Image
                  <div className="my-2 bg-white rounded-xl border border-emerald-300 p-3 shadow-xs">
                    <div className="h-24 flex items-center justify-center border-b border-slate-100 pb-2 overflow-hidden">
                      <img 
                        src={document.signature?.signatureDataUrl} 
                        alt="Digital Signature" 
                        className="max-h-full max-w-full object-contain scale-[1.25] mix-blend-multiply"
                      />
                    </div>
                    <div className="pt-2 text-center text-xs text-slate-600">
                      <div className="font-bold text-slate-800">
                        ({document.signature?.signerName || document.patientName})
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ฐานะ: {document.signature?.relationship || 'ผู้ป่วย'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamp & Verification Seal */}
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
                <span>
                  {document.signature ? `ลงนามเมื่อ: ${document.signature.signedAt}` : 'สถานะ: ยังไม่ได้ลงนาม'}
                </span>
                {document.signature && (
                  <span className="inline-flex items-center text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* 2. Witness / Nurse Signature Box */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  ลายมือชื่อพยาน / เจ้าหน้าที่ผู้ให้ข้อมูล
                </div>

                <div className="my-2 bg-white rounded-xl border border-slate-200 p-3 shadow-xs text-center flex flex-col items-center justify-center h-32">
                  <div className="font-script text-2xl text-slate-700 italic select-none">
                    Supaporn S.
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-2">
                    ({document.content?.witnessName || 'พว. สุภาพร สุขสมบูรณ์'})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    พยาบาลวิชาชีพชำนาญการ (ว. 98124)
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
                <span>วันที่: {document.createdDate.split(' ')[0]}</span>
                <span className="text-slate-400">โรงพยาบาลกรุงเทพสิริโรจน์</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Footer Audit Trail */}
        <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between gap-2">
          <div>
            System Reference: iMed-eSign-v1.0 • Device: {document.signature?.deviceInfo || 'iPad Station'}
          </div>
          <div>
            ISO/IEC 27001 Medical Data Security Standard Compliant
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        document={document}
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onConfirmSignature={handleConfirmSignature}
      />
    </div>
  );
}
