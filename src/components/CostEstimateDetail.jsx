import React, { useState } from 'react';
import { 
  ArrowLeft, 
  PenTool, 
  CheckCircle2, 
  Printer, 
  QrCode,
  UserCircle2,
  Check,
  Square,
  CheckSquare
} from 'lucide-react';
import SignatureModal from './SignatureModal';

export default function CostEstimateDetail({ document, onBack, onSaveSignature }) {
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Agreement Checkboxes
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  if (!document) return null;

  const isPending = document.status === 'PENDING';
  const canSign = agree1 && agree2;

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
    <div className="space-y-6 max-w-5xl mx-auto pb-16 print:m-0 print:p-0 print:space-y-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="print:hidden fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="print:hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
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

      {/* PDF-like Formal Document Container (A4 Paper Aesthetic) */}
      <div className="bg-white rounded-xl shadow-md border border-slate-300 mx-auto w-full max-w-[210mm] min-h-[297mm] flex flex-col p-[10mm] sm:p-[15mm] print:shadow-none print:border-none print:mx-auto print:p-[10mm] print:w-full print:max-w-none print:h-auto print:min-h-0 print:max-h-none print:overflow-visible print:box-border">
        
        {/* Row 1: Header Logos & Patient Info */}
        <div className="grid grid-cols-12 gap-2 mb-2 text-[11px] font-sans">
          {/* Logo Column */}
          <div className="col-span-3 flex flex-col justify-between">
            <div className="flex items-start justify-center w-full">
              <img 
                src="/siriroj-logo.svg" 
                alt="Bangkok Hospital Siriroj" 
                className="w-[140px] h-auto object-contain print:grayscale" 
              />
            </div>
            <div className="border border-black w-full text-center py-0.5 bg-white">
              <div className="font-bold text-[9px] leading-tight tracking-tight whitespace-nowrap">แบบฟอร์มประเมินค่ารักษาพยาบาล</div>
              <div className="text-[7px] leading-tight tracking-tighter whitespace-nowrap">Medical Treatment Cost Estimate Form</div>
            </div>
          </div>
          
          {/* Photo Column */}
          <div className="col-span-2 border border-black bg-gray-200 flex items-center justify-center overflow-hidden">
            {document.patientPhoto ? (
               <img src={document.patientPhoto} alt="Patient" className="w-full h-full object-cover grayscale" />
            ) : (
               <UserCircle2 className="w-16 h-16 text-gray-400" />
            )}
          </div>

          {/* Patient Details Column */}
          <div className="col-span-5 border border-black p-1.5 flex flex-col justify-center leading-[1.1]">
            <div className="flex items-end mb-1">
              <span className="font-semibold shrink-0 mr-1">Patient Name :</span>
              <span className="font-bold flex-grow border-b border-dotted border-black">{document.patientName}</span>
            </div>
            <div className="flex items-end mb-1">
              <span className="font-semibold shrink-0 mr-1">Date of birth (DD/MM/YYYY) :</span>
              <span className="flex-grow border-b border-dotted border-black">{document.patientDOB}</span>
            </div>
            <div className="flex items-end mb-1">
              <span className="font-semibold shrink-0 mr-1">Age :</span>
              <span className="flex-grow border-b border-dotted border-black">{document.patientAgeDetail}</span>
            </div>
            <div className="flex items-end mb-1">
              <span className="font-semibold shrink-0 mr-1">HN :</span>
              <span className="w-24 border-b border-dotted border-black mr-2">{document.hn}</span>
              <span className="font-semibold shrink-0 mr-1">VN/AN :</span>
              <span className="flex-grow border-b border-dotted border-black">{document.vn}</span>
            </div>
            <div className="flex items-end mb-1">
              <span className="font-semibold shrink-0 mr-1">Visit/Admit Date:</span>
              <span className="w-20 border-b border-dotted border-black mr-2">{document.orDate}</span>
              <span className="font-semibold shrink-0 mr-1">Gender :</span>
              <span className="flex-grow border-b border-dotted border-black">{document.patientGender}</span>
            </div>
            <div className="flex items-end">
              <span className="font-semibold shrink-0 mr-1">Allergies:</span>
              <span className="font-bold flex-grow border-b border-dotted border-black">{document.allergies}</span>
            </div>
          </div>

          {/* QR Code Column */}
          <div className="col-span-2 flex flex-col items-center justify-center">
            <QrCode className="w-[70px] h-[70px] text-black" />
          </div>
        </div>

        {/* Row 2: Medical Details */}
        <div className="grid grid-cols-12 gap-0 border border-black mb-2 text-[11px] bg-gray-50/50">
          <div className="col-span-3 p-1.5 border-r border-black flex flex-col">
            <div>
              <span className="font-semibold block">เลขที่อ้างอิง การตรวจสอบสิทธิ์/</span>
              <span className="text-[10px] block mb-1">Pre-Authorize-Ref.:</span>
            </div>
            <div>{document.preAuthorizeRef}</div>
          </div>
          <div className="col-span-6 p-1.5 border-r border-black flex flex-col justify-between relative">
            <div className="mb-1">
              <span className="font-semibold whitespace-nowrap mr-1">วินิจฉัยโรค/Diagnosis :</span>
              <span>{document.diagnosis}</span>
            </div>
            <div className="mb-3">
              <span className="font-semibold whitespace-nowrap mr-1">หัตถการ/Procedure :</span>
              <span>{document.procedure}</span>
            </div>
            <div className="flex justify-between items-center mt-auto pr-2">
              <div className="flex items-center gap-1.5">
                {document.admitType === 'Admit' ? <CheckSquare className="w-3.5 h-3.5 text-black" strokeWidth={2.5} /> : <Square className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />}
                <span>Admit</span>
              </div>
              <div className="flex gap-1 items-end">
                <span>LOS:</span>
                <span className="border-b border-dotted border-gray-400 w-32 inline-block h-3">{document.los}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {document.admitType === 'Day Case' ? <CheckSquare className="w-3.5 h-3.5 text-black" strokeWidth={2.5} /> : <Square className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />}
                <span>Day Case</span>
              </div>
            </div>
          </div>
          <div className="col-span-3 p-1.5 flex flex-col justify-between">
            <div className="mb-2">
              <span className="font-semibold block">ชนิดของการดมยา/Anesthesia :</span>
              <span>{document.anesthesia}</span>
            </div>
            <div className="whitespace-nowrap text-[10.5px] tracking-tighter">
              <span className="font-semibold">วันนัดผ่าตัด/OR date : </span>
              <span>{document.orDate}</span>
            </div>
          </div>
        </div>

        {/* Row 3: Cost Breakdown Table */}
        <table className="w-full border-collapse border border-black text-[12px] mb-2">
          <thead className="bg-gray-200 font-semibold">
            <tr>
              <th className="border border-black p-1.5 text-left w-20">SIM B</th>
              <th className="border border-black p-1.5 text-left">รายละเอียดค่ารักษาพยาบาล/Medical Cost Details</th>
              <th className="border border-black p-1.5 text-right w-40">จำนวนเงิน (บาท)/Amount (Baht)</th>
            </tr>
          </thead>
          <tbody>
            {document.costItems.map((item, index) => (
              <tr key={index}>
                <td className="border border-black p-1.5">{item.simCode}</td>
                <td className="border border-black p-1.5">{item.description}</td>
                <td className="border border-black p-1.5 text-right">
                  {item.amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold text-[13px]">
              <td className="border border-black p-2" colSpan={2}>รวมค่าใช้จ่ายทั้งสิ้น/Total</td>
              <td className="border border-black p-2 text-right">
                {document.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Row 4: Note & Agreements */}
        <div className="mb-2 text-[11px] leading-tight space-y-1">
          <div className="flex items-end">
            <span className="font-bold w-10">Note:</span>
            <span className="border-b border-dotted border-black flex-grow block h-4"></span>
          </div>
        </div>
          
        <div className="border border-black p-1.5 font-bold mb-1.5 text-[11px] bg-gray-100/50">
          โปรดชำระเงินมัดจำ {document.depositPercent}% ของราคาประเมินก่อนเข้ารับบริการ / A Deposit of {document.depositPercent}% is required before surgery =
        </div>

          <div className="space-y-2 px-2">
            <label className="flex items-start gap-2 cursor-pointer group">
              <div className={`mt-0.5 shrink-0 ${!isPending && 'opacity-50 pointer-events-none'}`}>
                {agree1 ? (
                  <CheckSquare className="w-4 h-4 text-black" strokeWidth={2} />
                ) : (
                  <Square className="w-4 h-4 text-gray-500 group-hover:text-black" strokeWidth={2} />
                )}
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={agree1} 
                  onChange={(e) => isPending && setAgree1(e.target.checked)}
                />
              </div>
              <div className="text-gray-800 text-[11px] leading-relaxed">
                {document.agreementText1.split('\n').map((line, i) => (
                  <p key={i} className="mb-0.5 last:mb-0">{line}</p>
                ))}
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer group">
              <div className={`mt-0.5 shrink-0 ${!isPending && 'opacity-50 pointer-events-none'}`}>
                {agree2 ? (
                  <CheckSquare className="w-4 h-4 text-black" strokeWidth={2} />
                ) : (
                  <Square className="w-4 h-4 text-gray-500 group-hover:text-black" strokeWidth={2} />
                )}
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={agree2} 
                  onChange={(e) => isPending && setAgree2(e.target.checked)}
                />
              </div>
              <div className="text-gray-800 text-[11px] leading-relaxed">
                {document.agreementText2.split('\n').map((line, i) => (
                  <p key={i} className="mb-1 last:mb-0">{line}</p>
                ))}
              </div>
            </label>
          </div>

        {/* Row 5: Exclusions */}
        <div className="mb-2 text-[11px] leading-relaxed">
          <div className="font-bold text-[12px] mb-1">การประเมินราคานี้ไม่คุ้มครอง (This Estimate not Include)</div>
          <div className="text-gray-700">
            {document.exclusions.split('\n').map((line, i) => (
              <p key={i} className="mb-0.5 last:mb-0">{line}</p>
            ))}
          </div>
        </div>

        {/* Row 6: Signatures */}
        <div className="grid grid-cols-3 gap-8 text-[11px] mt-6 mb-1 px-4">
          
          {/* Patient Signature Slot (iPad Interactive) */}
          <div className="flex flex-col items-center">
            <div className="w-full border-b border-dotted border-black h-10 mb-2 flex items-end justify-center pb-1 relative">
              {isPending ? (
                <div 
                  className={`print:hidden absolute inset-0 -top-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                    canSign 
                      ? 'border-blue-400 bg-blue-50/50 cursor-pointer hover:bg-blue-100/60' 
                      : 'border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => canSign && setIsSignModalOpen(true)}
                >
                  <PenTool className={`w-5 h-5 mb-1 ${canSign ? 'text-blue-500 animate-bounce' : 'text-gray-400'}`} />
                  <span className={`font-bold text-[10px] ${canSign ? 'text-blue-700' : 'text-gray-500'}`}>
                    {canSign ? 'แตะที่นี่เพื่อลงลายมือชื่อ' : 'ติ๊กยอมรับเงื่อนไขก่อนเซ็น'}
                  </span>
                </div>
              ) : (
                <div className="absolute bottom-0 w-full flex items-center justify-center translate-y-1">
                  <img 
                    src={document.signature?.signatureDataUrl} 
                    alt="Signature" 
                    className="max-h-20 w-auto object-contain scale-[1.3] mix-blend-multiply"
                  />
                </div>
              )}
            </div>
            <div className="text-center w-full text-[9px] whitespace-nowrap tracking-tighter">
              (ผู้ป่วย, ญาติ / Patient or Representative)
            </div>
            {!isPending && document.signature && (
               <div className="text-[9px] text-gray-500 mt-1">
                 {document.signature.signedAt}
               </div>
            )}
          </div>

          {/* Hospital Estimator Slot */}
          <div className="flex flex-col items-center">
            <div className="w-full border-b border-dotted border-black h-10 mb-2">
            </div>
            <div className="text-center w-full text-[9px] whitespace-nowrap tracking-tighter">
              (เจ้าหน้าที่ประเมินค่าใช้จ่าย / Hospital Estimator)
            </div>
          </div>

          {/* International Coordinator Slot */}
          <div className="flex flex-col items-center">
            <div className="w-full border-b border-dotted border-black h-10 mb-2">
            </div>
            <div className="text-center w-full text-[9px] whitespace-nowrap tracking-tighter">
              (ผู้ประสานงาน / International Coordinator)
            </div>
          </div>
        </div>

        <div className="text-[9px] text-gray-600 mt-3">
          <span className="font-bold">***หมายเหตุ เอกสารนี้มีระยะเวลา {document.validDays} วัน นับจากวันที่ทำการประเมินราคา</span>
          <span> Remark: This document is valid {document.validDays} days after agreement to this estimate.</span>
        </div>

        {/* Row 7: Footer */}
        <div className="mt-auto pt-4 flex justify-between items-end text-[9px] text-gray-600">
          <div className="w-1/3"></div>
          <div className="w-1/3 text-center">1/1</div>
          <div className="w-1/3 text-right">{document.formCode}</div>
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
