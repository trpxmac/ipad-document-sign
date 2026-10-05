/**
 * iMed Integration Service (Hospital Information System Integration Layer)
 * 
 * NOTE TO PI LEK (สำหรับพี่เล็กเชื่อมต่อระบบ iMed):
 * โครงสร้าง Service นี้ถูกออกแบบตาม Clean Architecture เพื่อแยก UI ออกจาก Data Layer
 * ปัจจุบันระบบทำงานด้วย Mock In-Memory & LocalStorage (USE_REAL_IMED_API = false)
 * 
 * เมื่อต้องการเชื่อมต่อกับระบบ iMed จริงในอนาคต:
 * 1. เปลี่ยน USE_REAL_IMED_API เป็น true หรือใส่ VITE_IMED_API_URL ใน .env
 * 2. เปลี่ยนการทำงานในฟังก์ชัน fetch จาก Mock เป็น REST API Endpoints ของ iMed
 */

import { INITIAL_MOCK_DOCUMENTS } from '../mock/mockDocuments';

const STORAGE_KEY = 'bsi_imed_mock_documents_v1';
export const USE_REAL_IMED_API = false;
export const IMED_API_BASE_URL = import.meta.env.VITE_IMED_API_URL || 'https://imed-api.siriroj.bdms.co.th/api/v1';

// Helper to get active documents from LocalStorage fallback
function getStoredDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DOCUMENTS));
      return INITIAL_MOCK_DOCUMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored documents:', e);
    return INITIAL_MOCK_DOCUMENTS;
  }
}

function saveStoredDocuments(docs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error('Error saving documents to storage:', e);
  }
}

/**
 * ดึงรายการเอกสารทั้งหมด (รองรับ Filter & Search)
 * @param {Object} options { search, status, category }
 * @returns {Promise<Array>}
 */
export async function fetchDocumentList(options = {}) {
  // Simulate network latency like a real hospital API
  await new Promise(resolve => setTimeout(resolve, 150));

  if (USE_REAL_IMED_API) {
    // [FOR PI LEK]: Real REST API implementation
    // const params = new URLSearchParams(options);
    // const res = await fetch(`${IMED_API_BASE_URL}/documents?${params.toString()}`);
    // return await res.json();
    throw new Error('Real iMed API is not yet configured');
  }

  // Mock implementation
  let list = getStoredDocuments();
  const { search, status, category } = options;

  if (status && status !== 'ALL') {
    list = list.filter(item => item.status === status);
  }

  if (category && category !== 'ALL') {
    list = list.filter(item => item.documentCategory === category);
  }

  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    list = list.filter(item =>
      item.hn.toLowerCase().includes(term) ||
      item.patientName.toLowerCase().includes(term) ||
      item.documentType.toLowerCase().includes(term) ||
      item.department.toLowerCase().includes(term)
    );
  }

  return list;
}

/**
 * ดึงข้อมูลเอกสารและผู้ป่วยรายใบ (Document Detail)
 * @param {string} documentId
 * @returns {Promise<Object>}
 */
export async function fetchDocumentById(documentId) {
  await new Promise(resolve => setTimeout(resolve, 100));

  if (USE_REAL_IMED_API) {
    // [FOR PI LEK]: Real REST API implementation
    // const res = await fetch(`${IMED_API_BASE_URL}/documents/${documentId}`);
    // return await res.json();
    throw new Error('Real iMed API is not yet configured');
  }

  const list = getStoredDocuments();
  const doc = list.find(item => item.id === documentId);
  if (!doc) {
    throw new Error(`ไม่พบเอกสารรหัส ${documentId} ในระบบ`);
  }
  return doc;
}

/**
 * ส่งข้อมูลลายเซ็นเพื่อบันทึกลงระบบ iMed (Submit Signature)
 * @param {Object} payload 
 * @param {string} payload.documentId
 * @param {string} payload.signatureDataUrl (Base64 PNG from Canvas)
 * @param {string} payload.signerName
 * @param {string} payload.relationship
 * @param {string} [payload.witnessName]
 * @returns {Promise<Object>}
 */
export async function submitDocumentSignature(payload) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const now = new Date();
  const thaiFormattedDate = now.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const signatureRecord = {
    signerName: payload.signerName || 'ผู้ป่วย / ผู้มีอำนาจลงนาม',
    relationship: payload.relationship || 'ผู้ป่วย',
    signatureDataUrl: payload.signatureDataUrl,
    signedAt: thaiFormattedDate,
    isoTimestamp: now.toISOString(),
    witnessName: payload.witnessName || 'พยาบาลวิชาชีพผู้ประสานงาน',
    deviceInfo: navigator.userAgent.includes('iPad') || navigator.maxTouchPoints > 1 
      ? 'iPad Tablet (iOS / iPadOS)' 
      : 'Web Desktop Workstation',
    verifiedStatus: 'DIGITALLY_SIGNED'
  };

  if (USE_REAL_IMED_API) {
    // [FOR PI LEK]: Real REST API implementation
    // const res = await fetch(`${IMED_API_BASE_URL}/documents/${payload.documentId}/sign`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(signatureRecord)
    // });
    // return await res.json();
    throw new Error('Real iMed API is not yet configured');
  }

  // Update in stored documents
  const list = getStoredDocuments();
  const targetIndex = list.findIndex(item => item.id === payload.documentId);
  if (targetIndex === -1) {
    throw new Error(`ไม่พบเอกสารรหัส ${payload.documentId}`);
  }

  const prevSignatures = list[targetIndex].signatures || {};
  if (list[targetIndex].signature && !prevSignatures.PATIENT) {
    prevSignatures.PATIENT = list[targetIndex].signature;
  }

  const updatedDoc = {
    ...list[targetIndex],
    status: 'SIGNED',
    signature: payload.role === 'PATIENT' ? signatureRecord : list[targetIndex].signature,
    signatures: {
      ...prevSignatures,
      [payload.role || 'PATIENT']: signatureRecord
    },
    updatedDate: thaiFormattedDate
  };

  list[targetIndex] = updatedDoc;
  saveStoredDocuments(list);

  return {
    success: true,
    message: 'บันทึกลายเซ็นและอัปเดตสถานะในระบบเรียบร้อยแล้ว',
    document: updatedDoc
  };
}

/**
 * รีเซ็ตข้อมูลกลับสู่ค่าเริ่มต้น Mock (สำหรับทดสอบ Flow)
 */
export function resetMockData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DOCUMENTS));
  return INITIAL_MOCK_DOCUMENTS;
}
