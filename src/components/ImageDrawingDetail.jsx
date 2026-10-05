import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Eraser, Download, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';

export default function ImageDrawingDetail({ document, onBack, onSaveSignature }) {
  const [toastMessage, setToastMessage] = useState(null);
  const [errorToast, setErrorToast] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Resize canvas to match the image dimensions
  const initCanvas = () => {
    if (canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const rect = containerRef.current.getBoundingClientRect();
      
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
      
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#2563eb'; // Blue ink
      ctxRef.current = ctx;
    }
  };

  useEffect(() => {
    // Wait a bit for the image to load and take up space
    const timer = setTimeout(initCanvas, 500);
    window.addEventListener('resize', initCanvas);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initCanvas);
    };
  }, []);

  const getCoordinates = (e) => {
    if (!canvasRef.current) return { offsetX: 0, offsetY: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    }
    return {
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY
    };
  };

  const startDrawing = (e) => {
    if (!ctxRef.current) return;
    const { offsetX, offsetY } = getCoordinates(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !ctxRef.current) return;
    e.preventDefault(); 
    const { offsetX, offsetY } = getCoordinates(e);
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!ctxRef.current) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current && ctxRef.current) {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleSaveJpeg = async () => {
    if (!containerRef.current) return;
    setIsExporting(true);
    try {
      const node = containerRef.current;
      
      const exportOptions = {
        quality: 1.0,
        backgroundColor: 'white',
        pixelRatio: 2,
        width: node.offsetWidth,
        height: node.offsetHeight,
        style: {
          margin: '0', 
          borderRadius: '0', 
          boxShadow: 'none', 
          border: 'none',
          transform: 'none'
        }
      };

      // Wait a tick for CSS changes
      await new Promise(resolve => setTimeout(resolve, 50));

      if (window.showSaveFilePicker) {
        const handle = await window.showSaveFilePicker({
          suggestedName: `annotated-doc-${document.hn}.jpg`,
          types: [{
            description: 'JPEG Image',
            accept: { 'image/jpeg': ['.jpg', '.jpeg'] }
          }]
        });
        
        const dataUrl = await toJpeg(node, exportOptions);
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        const dataUrl = await toJpeg(node, exportOptions);
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        saveAs(blob, `annotated-doc-${document.hn}.jpg`);
      }
      
      setToastMessage('บันทึกเป็นไฟล์ JPEG สำเร็จ!');
      
      // Update status in mock service
      await onSaveSignature({ 
        documentId: document.id,
        status: 'COMPLETED'
      });
      
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setErrorToast('เกิดข้อผิดพลาดในการบันทึกรูปภาพ');
        setTimeout(() => setErrorToast(null), 4000);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 print:m-0 print:p-0 print:space-y-0">
      {toastMessage && (
        <div className="print:hidden fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {errorToast && (
        <div className="print:hidden fixed top-6 right-6 z-50 bg-rose-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center space-x-2 animate-bounce">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{errorToast}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="print:hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium text-sm transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้ารายการเอกสาร
          </button>
          
          <button
            onClick={clearCanvas}
            className="inline-flex items-center px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 font-medium text-sm transition cursor-pointer"
          >
            <Eraser className="w-4 h-4 mr-2" />
            ล้างภาพวาด
          </button>

          <button
            onClick={handleSaveJpeg}
            disabled={isExporting}
            className="inline-flex items-center px-4 py-2.5 rounded-xl border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium text-sm transition cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'กำลังบันทึก...' : 'บันทึกและเสร็จสิ้น'}
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
            โหมดขีดเขียนอิสระ (Freehand Draw)
          </span>
        </div>
      </div>

      {/* Drawing Canvas Container */}
      <div 
        ref={containerRef} 
        className="bg-white mx-auto relative paper-shadow print:shadow-none print:m-0 cursor-crosshair overflow-hidden"
        style={{ width: 'fit-content' }}
      >
        <img 
          src={document.imageUrl} 
          alt="Scanned Document" 
          className="max-w-[210mm] w-full h-auto select-none pointer-events-none block" 
          onLoad={initCanvas}
        />
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute top-0 left-0 w-full h-full z-10 touch-none"
        />
      </div>
    </div>
  );
}
