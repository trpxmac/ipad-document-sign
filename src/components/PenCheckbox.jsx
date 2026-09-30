import React, { useRef, useState, useEffect } from 'react';
import SignaturePad from 'signature_pad';
import { RotateCcw } from 'lucide-react';

export default function PenCheckbox({ checked, onChange, disabled }) {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);
  const [hasDrawn, setHasDrawn] = useState(checked);

  // Initialize signature pad
  useEffect(() => {
    if (canvasRef.current && !signaturePadRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        penColor: '#2563eb', // blue-600
        minWidth: 1,
        maxWidth: 2.5,
      });

      signaturePadRef.current.addEventListener('endStroke', () => {
        setHasDrawn(true);
        onChange(true);
      });
    }

    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, [onChange]);

  // Handle external checked state changes
  useEffect(() => {
    if (checked && !hasDrawn) {
      setHasDrawn(true);
    } else if (!checked && hasDrawn && signaturePadRef.current) {
      signaturePadRef.current.clear();
      setHasDrawn(false);
    }
  }, [checked, hasDrawn]);

  // Handle resize to fix canvas resolution
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        
        // Save current drawing if any
        const data = signaturePadRef.current ? signaturePadRef.current.toData() : null;
        
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);
        
        if (signaturePadRef.current && data) {
          signaturePadRef.current.fromData(data);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClear = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (disabled) return;
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
    setHasDrawn(false);
    onChange(false);
  };

  return (
    <div className="relative inline-block">
      <div 
        className={`w-8 h-8 rounded border-2 overflow-hidden flex items-center justify-center bg-white transition-colors
          ${hasDrawn ? 'border-blue-600' : 'border-slate-300'} 
          ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'cursor-crosshair'}
        `}
      >
        <canvas 
          ref={canvasRef}
          className="w-full h-full absolute inset-0 touch-none"
          style={{ pointerEvents: disabled ? 'none' : 'auto' }}
        />
        
        {/* Helper text when empty */}
        {!hasDrawn && !disabled && (
          <span className="text-[8px] text-slate-300 pointer-events-none select-none relative z-10">
            ขีด ✓
          </span>
        )}
      </div>

      {/* Clear Button */}
      {hasDrawn && !disabled && (
        <button 
          onClick={handleClear}
          className="absolute -top-2 -right-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full p-0.5 shadow-sm border border-slate-200 transition-colors z-20"
          title="ล้างขีด"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
