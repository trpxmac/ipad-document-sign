import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DocumentList from './components/DocumentList';
import DocumentDetail from './components/DocumentDetail';
import CostEstimateDetail from './components/CostEstimateDetail';
import PdfDocumentViewer from './components/PdfDocumentViewer';
import { 
  fetchDocumentList, 
  fetchDocumentById, 
  submitDocumentSignature, 
  resetMockData 
} from './services/imedService';
import { Tablet, CheckCircle, Info, FileText } from 'lucide-react';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load document list
  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDocumentList();
      setDocuments(data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถเชื่อมต่อข้อมูล iMed Mock ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // When a document is selected to view/sign
  const handleSelectDocument = async (id) => {
    setSelectedDocId(id);
    try {
      const doc = await fetchDocumentById(id);
      setSelectedDoc(doc);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(err.message);
    }
  };

  // Back to list
  const handleBackToList = () => {
    setSelectedDocId(null);
    setSelectedDoc(null);
    loadDocuments(); // Refresh latest status
  };

  // Handle signature submission
  const handleSaveSignature = async (payload) => {
    const res = await submitDocumentSignature(payload);
    // Update local state with the returned signed document
    setSelectedDoc(res.document);
    // Also update in list
    setDocuments((prev) =>
      prev.map((item) => (item.id === payload.documentId ? res.document : item))
    );
  };

  // Reset Mock Data handler
  const handleResetData = () => {
    if (confirm('คุณต้องการรีเซ็ตเอกสารทั้งหมดกลับสู่สถานะเริ่มต้นสำหรับการทดสอบหรือไม่?')) {
      const freshDocs = resetMockData();
      setDocuments(freshDocs);
      if (selectedDocId) {
        const found = freshDocs.find((d) => d.id === selectedDocId);
        setSelectedDoc(found || null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar onResetData={handleResetData} />

      {/* Integration Notice Banner for Pi Lek & Mentors */}
      <div className="print:hidden bg-blue-50 border-b border-blue-200 text-blue-900 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tablet className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>iPad Prototype Mode:</strong> ระบบเซ็นเอกสารบน iPad (Mock Service Layer พร้อมต่อ iMed REST API)
            </span>
          </div>
          <span className="hidden sm:inline text-blue-600 text-[11px]">
            Short Workflow: รายการ → เลือก → ตรวจสอบ → เซ็น → ยืนยัน
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {selectedDocId && selectedDoc ? (
          selectedDoc.documentCategory === 'COST_ESTIMATE' ? (
            <CostEstimateDetail
              document={selectedDoc}
              onBack={handleBackToList}
              onSaveSignature={handleSaveSignature}
            />
          ) : selectedDoc.documentCategory === 'PDF_DOCUMENT' ? (
            <PdfDocumentViewer
              document={selectedDoc}
              onBack={handleBackToList}
              onSaveSignature={handleSaveSignature}
            />
          ) : (
            <DocumentDetail
              document={selectedDoc}
              onBack={handleBackToList}
              onSaveSignature={handleSaveSignature}
            />
          )
        ) : (
          <DocumentList
            documents={documents}
            onSelectDocument={handleSelectDocument}
            loading={loading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="print:hidden bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 โรงพยาบาลกรุงเทพสิริโรจน์ (Bangkok Hospital Siriroj)</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            iMed e-Signature Tablet Station • Ready for iMed API Integration by Pi Lek
          </p>
        </div>
      </footer>
    </div>
  );
}
