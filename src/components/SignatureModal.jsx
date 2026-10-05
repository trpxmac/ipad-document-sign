import React, { useRef, useEffect, useState } from 'react';
import SignaturePad from 'signature_pad';
import { 
  PenTool, 
  RotateCcw, 
  Check, 
  X, 
  UserCheck, 
  Users, 
  ShieldAlert, 
  Eye, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function SignatureModal({ document, isOpen, role, onClose, onConfirmSignature }) {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);

  // Signer options
  const [signerType, setSignerType] = useState('PATIENT'); // 'PATIENT' | 'REPRESENTATIVE'
  const [signerName, setSignerName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [representativeReason, setRepresentativeReason] = useState('ผู้ป่วยมีข้อจำกัดทางกายภาพชั่วคราว');
  
  // State for preview & error
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
      setErrorMessage('');
      setPreviewUrl(null);
      
      if (role === 'ESTIMATOR') {
        setSignerName('');
        setRelationship('เจ้าหน้าที่ประเมินค่าใช้จ่าย');
      } else if (role === 'COORDINATOR') {
        setSignerName('');
        setRelationship('ผู้ประสานงาน');
      } else {
        setSignerType('PATIENT');
        setSignerName(document ? document.patientName : '');
        setRelationship('ผู้ป่วย');
      }
    }
  }, [isOpen, role, document]);

  // Initialize or resize Signature Pad
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    
    // Resize canvas for iPad Retina display
    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(ratio, ratio);
      
      if (signaturePadRef.current) {
        signaturePadRef.current.clear();
      }
    };

    // Initialize SignaturePad with high fidelity settings for Apple Pencil
    signaturePadRef.current = new SignaturePad(canvas, {
      minWidth: 1.5,
      maxWidth: 3.8,
      penColor: '#0f172a', // Midnight formal ink
      velocityFilterWeight: 0.7,
      throttle: 16,
    });

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, [isOpen]);

  // When signer type switches
  const handleSignerTypeChange = (type) => {
    setSignerType(type);
    if (type === 'PATIENT') {
      setSignerName(document.patientName);
      setRelationship('ผู้ป่วย');
    } else {
      setSignerName('');
      setRelationship('คู่สมรส / บุตร / ผู้แทนโดยชอบธรรม');
    }
    setErrorMessage('');
  };

  // Clear signature
  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setPreviewUrl(null);
      setErrorMessage('');
    }
  };

  // Generate preview
  const handleGeneratePreview = () => {
    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
      setErrorMessage('กรุณาลงลายมือชื่อในกรอบก่อนดูตัวอย่างหรือยืนยัน');
      return;
    }
    setErrorMessage('');
    const dataUrl = signaturePadRef.current.toDataURL('image/png');
    setPreviewUrl(dataUrl);
  };

  // Confirm Signature
  const handleConfirm = async () => {
    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
      setErrorMessage('กรุณาจรดปากกาหรือใช้นิ้วลงลายมือชื่อในช่องด้านล่างก่อนกดยืนยัน');
      return;
    }

    if (!signerName.trim()) {
      setErrorMessage('กรุณาระบุชื่อ-นามสกุลของผู้ลงนาม');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const signatureDataUrl = signaturePadRef.current.toDataURL('image/png');

    try {
      await onConfirmSignature({
        documentId: document.id,
        signatureDataUrl,
        signerName: signerName.trim(),
        relationship: relationship,
        representativeReason: signerType === 'REPRESENTATIVE' ? representativeReason : null,
        witnessName: document.content?.witnessName || 'พว. สุภาพร สุขสมบูรณ์'
      });
    } catch (err) {
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการบันทึกลายเซ็น');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                ลงลายมือชื่อดิจิทัล 
                {role === 'ESTIMATOR' ? ' (เจ้าหน้าที่ประเมินค่าใช้จ่าย)' : 
                 role === 'COORDINATOR' ? ' (ผู้ประสานงาน)' : 
                 ' (ผู้รับบริการ)'}
              </h2>
              <p className="text-xs text-slate-300">
                HN: {document.hn} • {document.patientName} • {document.documentType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-10 h-10 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Signer Selection - Big touch radio pills */}
          {(!role || role === 'PATIENT') && (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                ผู้มีอำนาจลงลายมือชื่อ (Signer Category)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSignerTypeChange('PATIENT')}
                  className={`flex items-center p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    signerType === 'PATIENT'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className={`w-5 h-5 mr-3 shrink-0 ${signerType === 'PATIENT' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-sm">ผู้ป่วยลงนามด้วยตนเอง</div>
                    <div className="text-xs font-normal text-slate-500">สำหรับผู้ป่วยที่รู้สึกตัวดีและบรรลุนิติภาวะ</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSignerTypeChange('REPRESENTATIVE')}
                  className={`flex items-center p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    signerType === 'REPRESENTATIVE'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Users className={`w-5 h-5 mr-3 shrink-0 ${signerType === 'REPRESENTATIVE' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-sm">ญาติ / ผู้แทนโดยชอบธรรม</div>
                    <div className="text-xs font-normal text-slate-500">กรณีผู้ป่วยเป็นผู้เยาว์หรือไม่สามารถลงนามได้</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Signer Details Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อ-นามสกุล ผู้ลงนาม <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="ระบุชื่อ-นามสกุล..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ตำแหน่ง / ความสัมพันธ์
              </label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                disabled={(!role || role === 'PATIENT') && signerType === 'PATIENT'}
                placeholder={role === 'PATIENT' || !role ? "เช่น ผู้ป่วย, มารดา, สามี, บุตร..." : "ตำแหน่ง"}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>
          </div>

          {/* iPad Signature Canvas Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <PenTool className="w-4 h-4 mr-1.5 text-blue-600" />
                กรอบลงลายมือชื่อ (รองรับ Apple Pencil และ Touch)
              </span>
              <span className="text-xs text-slate-500 flex items-center">
                <HelpCircle className="w-3.5 h-3.5 mr-1" />
                จรดปากกาหรือใช้นิ้วเซ็นในกรอบสีขาว
              </span>
            </div>

            {/* Canvas Box */}
            <div className="relative border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden bg-white shadow-inner">
              <canvas
                ref={canvasRef}
                className="signature-canvas w-full h-52 sm:h-64 block bg-white"
                style={{ touchAction: 'none' }}
              />

              {/* Watermark / baseline guide */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none text-center">
                <div className="w-64 border-b border-slate-300 mb-1"></div>
                <span className="text-xs text-slate-400 font-medium">
                  เส้นแนวกึ่งกลางสำหรับลงลายมือชื่อ
                </span>
              </div>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              {errorMessage}
            </div>
          )}

          {/* Signature Preview Thumbnail (if checked) */}
          {previewUrl && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-40 h-20 bg-white rounded border border-emerald-300 flex items-center justify-center p-1 overflow-hidden">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain scale-[1.2]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-800">ตัวอย่างลายเซ็นพร้อมใช้งาน</div>
                  <div className="text-xs text-emerald-600">ลงนามโดย: {signerName} ({relationship})</div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setPreviewUrl(null)}
                className="text-xs text-emerald-700 underline px-2 py-1"
              >
                ปิดตัวอย่าง
              </button>
            </div>
          )}
        </div>

        {/* Modal Action Bar (Large touch targets for iPad) */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-8 py-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left Buttons: Clear & Preview */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium text-sm transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 mr-1.5 text-slate-500" />
              ล้างลายเซ็น
            </button>

            <button
              type="button"
              onClick={handleGeneratePreview}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium text-sm transition cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-1.5 text-slate-500" />
              ดูตัวอย่าง
            </button>
          </div>

          {/* Right Buttons: Cancel & Confirm */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-600 font-medium text-sm transition cursor-pointer"
            >
              ยกเลิก
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-1.5" />
                  ยืนยันการเซ็นเอกสาร
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
