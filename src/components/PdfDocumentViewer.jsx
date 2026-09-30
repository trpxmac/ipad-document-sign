import React, { useState } from 'react';
import { ArrowLeft, PenTool, CheckCircle2 } from 'lucide-react';
import SignatureModal from './SignatureModal';

export default function PdfDocumentViewer({ document, onBack, onSaveSignature }) {
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  if (!document) return null;

  const isPending = document.status === 'PENDING';

  const handleConfirmSignature = async (payload) => {
    await onSaveSignature(payload);
    setIsSignModalOpen(false);
    setToastMessage('บันทึกลายเซ็นดิจิทัลลง PDF สำเร็จ!');
    setTimeout(() => setToastMessage(null), 4000);
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
            <button
              onClick={() => setIsSignModalOpen(true)}
              className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition cursor-pointer bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-600/20"
            >
              <PenTool className="w-4 h-4 mr-2" />
              เซ็นเอกสารบน iPad (Sign PDF)
            </button>
          ) : (
            <span className="inline-flex items-center px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
              ลงนามใน PDF เสร็จสมบูรณ์แล้ว
            </span>
          )}
        </div>
      </div>

      {/* PDF Viewer Container */}
      <div className="bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden flex flex-col">
        <div className="bg-slate-800 text-white px-4 py-2 text-xs flex justify-between items-center">
          <span>{document.documentType} - {document.patientName}</span>
          <span>PDF Viewer Mode</span>
        </div>
        
        {/* Iframe to display the PDF */}
        <div className="w-full h-[600px] sm:h-[800px] bg-slate-200 relative">
          <iframe 
            src={document.pdfUrl ? `${document.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0` : ''} 
            className="w-full h-full border-none"
            title="PDF Document"
          />
          
          {!document.pdfUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
              <span className="text-lg font-bold mb-2">ไม่พบไฟล์ PDF (Mock Mode)</span>
              <span className="text-sm">จำลองการแสดงผล PDF จากระบบ iMed</span>
            </div>
          )}
        </div>

        {/* Mock Signature Area (Simulating stamping on PDF) */}
        {!isPending && document.signature && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col items-center justify-center">
            <h4 className="text-sm font-bold text-slate-700 mb-4">ลายเซ็นที่ประทับลงในเอกสาร PDF:</h4>
            <div className="bg-white border-2 border-dashed border-emerald-300 rounded-xl p-4 flex flex-col items-center">
              <img 
                src={document.signature.signatureDataUrl} 
                alt="Signature" 
                className="max-h-24 object-contain"
              />
              <div className="text-xs text-slate-500 mt-2">
                เซ็นโดย: {document.signature.signerName} ({document.signature.relationship})<br/>
                เมื่อ: {document.signature.signedAt}
              </div>
            </div>
          </div>
        )}
      </div>

      <SignatureModal
        document={document}
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onConfirmSignature={handleConfirmSignature}
      />
    </div>
  );
}
