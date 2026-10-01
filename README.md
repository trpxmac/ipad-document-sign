# ระบบเซ็นเอกสารดิจิทัลบน iPad (iPad Document e-Sign Prototype)
### โรงพยาบาลกรุงเทพสิริโรจน์ (Bangkok Hospital Siriroj)

ระบบต้นแบบ (Prototype Web Application) สำหรับการลงลายมือชื่อดิจิทัลบนเอกสารทางการแพทย์ผ่าน iPad โดยออกแบบให้พร้อมสำหรับการเชื่อมต่อกับระบบโรงพยาบาล **iMed (HIS)** ในอนาคต

---

## 📱 จุดเด่นและการออกแบบสำหรับ iPad (Key Features)

1. **หน้ารายการเอกสารรอเซ็น (Document List View):**
   - แสดงรายการเอกสารที่ส่งมาจากคลินิก/หอผู้ป่วย พร้อมระบุ HN, ชื่อผู้ป่วย, ประเภทเอกสาร, วันที่, และสถานะ
   - มีระบบ **Search** ค้นหาด้วย HN หรือชื่อคนไข้ และ **Filter** คัดกรองตามสถานะ (รอเซ็น / เซ็นแล้ว) และหมวดหมู่เอกสาร
   - แสดงตัวเลขสรุป (KPI Summary) เอกสารรอเซ็น / เซ็นแล้วในรอบเวร

2. **หน้ารายละเอียดเอกสาร (Document Detail / PDF-like Viewer):**
   - แสดงหัวเอกสารทางการแพทย์ของโรงพยาบาลกรุงเทพสิริโรจน์ (Bangkok Hospital Siriroj)
   - แถบข้อมูลผู้ป่วย (Patient Banner): HN, ชื่อ, เพศ, อายุ, บัตร ปชช/Passport
   - เนื้อหาข้อความยินยอมและข้อกำหนดทางการแพทย์ตามมาตรฐาน JCI
   - ปรับ Flow ให้สอดคล้องกับการใช้งานจริง โดยแตะที่ **ช่องลงลายมือชื่อด้านล่างเอกสาร** เพื่อเซ็นได้ทันที

3. **หน้าจอลงลายมือชื่อ (iPad Signature Screen):**
   - ปรับแต่ง Canvas ความละเอียดสูง (High-DPI Retina Display) ลายเส้นคมชัด
   - รองรับ **Apple Pencil** (น้ำหนักและเส้นโค้งที่นุ่มนวล) และการใช้นิ้วมือ
   - ป้องกันการเลื่อน/เด้งของหน้าจอขณะจรดปากกาเซ็น (`touch-action: none`)
   - เลือกระบุผู้ลงนามได้ระหว่าง **"ผู้ป่วยลงนามด้วยตนเอง"** หรือ **"ญาติ/ผู้แทนโดยชอบธรรม"**
   - ปุ่มฟังก์ชันครบครัน: **ล้างลายเซ็น (Clear)**, **ดูตัวอย่าง (Preview)**, **ยกเลิก (Cancel)**, **ยืนยันการเซ็นเอกสาร (Confirm)**

4. **หลังเซ็นสำเร็จ (Post-Signing State):**
   - อัปเดตสถานะเอกสารเป็น **"เซ็นเสร็จสมบูรณ์" (SIGNED)** ทันที
   - ประทับภาพลายเซ็นจริงลงบนเอกสาร พร้อมระบุ **วัน-เวลาที่เซ็น**, **ชื่อผู้เซ็น**, **ชื่อพยาน**, และเครื่องหมายความปลอดภัย

---

## 🔌 คู่มือสำหรับ "พี่เล็ก" ในการเชื่อมต่อระบบ iMed จริง (Integration Guide)

ระบบนี้สร้างขึ้นตามหลัก **Separation of Concerns (Clean Architecture)** โดยแยก **UI Components** ออกจาก **Data & Mock Service Layer** อย่างสิ้นเชิง หน้าจอ UI จะไม่มีการเรียก Mock Data โดยตรง แต่จะเรียกผ่าน Service Interface:

* ไฟล์ Service หลัก: [`src/services/imedService.js`](file:///D:/ipad-document-sign/src/services/imedService.js)
* ไฟล์ Mock Data: [`src/mock/mockDocuments.js`](file:///D:/ipad-document-sign/src/mock/mockDocuments.js)

### ขั้นตอนการเชื่อมต่อ iMed REST API:
1. เปิดไฟล์ `src/services/imedService.js`
2. ปรับตัวแปร `USE_REAL_IMED_API = true` หรือกำหนดค่าใน `.env`:
   ```env
   VITE_IMED_API_URL=https://imed-api.siriroj.bdms.co.th/api/v1
   ```
3. นำโค้ด `fetch` ที่เตรียม Template ไว้ในฟังก์ชันต่างๆ มาใช้งานจริง:
   - `fetchDocumentList(options)`: สำหรับดึงรายการเอกสารรอเซ็นจาก iMed
   - `fetchDocumentById(documentId)`: สำหรับดึงข้อมูลเอกสารและผู้ป่วยจาก iMed
   - `submitDocumentSignature(payload)`: สำหรับส่ง Base64 PNG ของลายเซ็น + Metadata เข้า iMed

### สเปกข้อมูล Payload ที่ระบบส่งออกเมื่อมีการเซ็นเอกสาร:
```json
{
  "documentId": "DOC-2026-001",
  "signatureDataUrl": "data:image/png;base64,iVBORw0KGgo...",
  "signerName": "นายสมชาย ใจดี",
  "relationship": "ผู้ป่วย",
  "witnessName": "พว. สุภาพร สุขสมบูรณ์",
  "signedAt": "30 ก.ย. 2569 11:15:00",
  "isoTimestamp": "2026-09-30T04:15:00.000Z",
  "deviceInfo": "iPad Tablet (iOS / iPadOS)",
  "verifiedStatus": "DIGITALLY_SIGNED"
}
```

---

## 💻 วิธีการรันโปรเจกต์และทดสอบบน iPad

### 1. รันบนเครื่องคอมพิวเตอร์:
เปิด Terminal ในโฟลเดอร์โปรเจกต์:
```bash
npm run dev
```

### 2. ทดสอบบนหน้าจอ iPad จริงผ่าน Wi-Fi:
เนื่องจากคอนฟิก Vite ได้เปิด `--host` ไว้เรียบร้อยแล้ว:
1. เชื่อมต่อ iPad เข้ากับ Wi-Fi เดียวกันกับคอมพิวเตอร์
2. ดู IP Address ใน Terminal ที่แสดงขึ้นมา เช่น `http://192.168.1.XX:5173`
3. เปิดเบราว์เซอร์ **Safari บน iPad** แล้วพิมพ์ URL ดังกล่าว
4. ทดลองใช้ Apple Pencil หรือนิ้วมือเซ็นเอกสารได้ทันที
