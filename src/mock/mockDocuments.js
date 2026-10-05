/**
 * Mock Data for Hospital Documents in iMed
 * Representing documents waiting for digital signature on iPad
 * Hospital: โรงพยาบาลกรุงเทพสิริโรจน์ (Bangkok Hospital Siriroj)
 */

export const INITIAL_MOCK_DOCUMENTS = [
  {
    id: "DOC-2026-005",
    hn: "67-26-025897",
    vn: "067-26-169871",
    patientName: "MR. JOE MOZES WATSON BROOKS",
    patientAge: 34,
    patientGender: "Male",
    idCard: "Passport: UK987654",
    rights: "Self Pay (International)",
    department: "แผนกศัลยกรรม (Surgery Clinic)",
    room: "OPD",
    attendingPhysician: "นพ. สมชาย รักษาดี",
    
    patientDOB: "05 ธ.ค. 2534",
    patientAgeDetail: "34 Y 10 M 8 D",
    allergies: "ไม่พบประวัติแพ้ยา",
    patientPhoto: null, 
    
    preAuthorizeRef: "R26-002190",
    diagnosis: "",
    procedure: "I&D",
    admitType: "",
    los: "",
    anesthesia: "Local Anesthesia",
    orDate: "2026-09-30",
    
    documentType: "แบบฟอร์มประเมินค่ารักษาพยาบาล (Medical Treatment Cost Estimate)",
    documentCategory: "COST_ESTIMATE",
    createdDate: "2026-09-30 10:30",
    status: "PENDING",
    urgency: "HIGH",
    formCode: "M/R-ADM-001.1 Rev.0 (26/02/2026)",
    summary: "ใบประเมินค่าใช้จ่ายหัตถการ I&D",
    
    costItems: [
      { simCode: "1.1(1)", description: "ค่ายาและสารอาหารทางหลอดเลือด(1)", amount: 1200 },
      { simCode: "1.2.1(1)", description: "บัญชีเวชภัณฑ์ 1 (1)", amount: 2500 },
      { simCode: "1.14", description: "ค่าบริการทางการพยาบาล-ผดุงครรภ์", amount: 100 },
      { simCode: "1.29(3)", description: "ค่าผู้ประกอบวิชาชีพเวชกรรม ทำศัลยกรรมและหัตถการ(3)", amount: 2500 },
      { simCode: "2.8", description: "ค่าบริการอื่นๆ ของสถานพยาบาล", amount: 200 },
    ],
    totalAmount: 6500,
    depositPercent: 80,
    
    agreementText1: "ข้าพเจ้าทราบดีว่าค่ารักษาพยาบาลนี้เป็นราคาประมาณเท่านั้น ซึ่งค่ารักษาพยาบาลที่เกิดขึ้นจริงอาจมีการเปลี่ยนแปลงได้ขึ้นอยู่กับระยะเวลา\nที่พักรักษาตัวในโรงพยาบาล และการตรวจเพิ่มเติมอื่นๆ / I understand that this estimated cost is provided as a guide and that\nthe final cost is likely to vary depending on the length of stay in hospital\nwhilst receiving treatments and other special investigations\nnot originally estimated.",
    agreementText2: "ข้าพเจ้ายินยอมชำระเงินเต็มจำนวนในกรณีที่บริษัทประกันปฏิเสธความคุ้มครองค่ารักษาพยาบาลในครั้งนี้ /\nI also accept that in the case where my/his/her insurance company refuses coverage, I promise to pay the full expenses upon\ndischarge.",
    
    exclusions: "ภาวะแทรกซ้อน / Any Complications, โรคประจำตัว / Underlying Diseases, ปรึกษาแพทย์ด้านอื่นๆ / Consultant Doctor (Other specialty), \nการผ่าตัดซ้ำ(Re-Operation), การติดตามหลังผ่าตัด (Follow up after operation), การนอนสังเกตอาการในห้องผู้ป่วยหนัก (Observe ICU, CCU, SICU), \nการให้เลือด / Blood Transfusion, ค่า CT scan, MRI, MRA / Cost of CT scan, MRI, MRA การตรวจวินิจฉัยเพิ่มเติม (Other special investigation)",
    
    signature: null,
    estimatorSignature: null,
    coordinatorSignature: null,
    
    validDays: 30
  },
  {
    id: "DOC-2026-006",
    hn: "67-26-025897",
    vn: "067-26-169871",
    patientName: "MR. JOE MOZES WATSON BROOKS",
    patientGender: "Male",
    patientAgeDetail: "34 Y 10 M 8 D",
    
    documentType: "เอกสารสแกน (Scanned Document) - วาดอิสระ",
    documentCategory: "IMAGE_DRAWING",
    createdDate: "2026-09-30 11:45",
    status: "PENDING",
    urgency: "NORMAL",
    imageUrl: "/sample-scanned-doc.jpg?v=2"
  }
];
