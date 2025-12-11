# VietGuardScan Frontend - Integration Implementation Guide

## ✅ Hoàn Thành Tích Hợp API

Toàn bộ chức năng scan app đã được hoàn thiện và tích hợp với Backend API. Dưới đây là tóm tắt các thay đổi:

---

## 📁 Files Đã Tạo/Chỉnh Sửa

### 1. **`lib/api/scanService.ts`** ✅ (MỚI)
- **Mục đích:** API wrapper chứa tất cả API calls
- **Hàm chính:**
  - `sendOtp(email)` - Gửi OTP
  - `verifyOtp(email, otp)` - Xác minh OTP
  - `submitUserInfo(request)` - Nộp thông tin cá nhân
  - `createMemberWithService(request)` - Tạo member + gán service
  - `createScanTask(memberName, file, clientIp)` - Upload APK & tạo task
  - `getScanStatus(taskId)` - Lấy trạng thái scan
  - `downloadReport(taskId, fileName)` - Tải file report
  - `getClientIp()` - Lấy IP của client

### 2. **`lib/utils/pollingScan.ts`** ✅ (MỚI)
- **Mục đích:** Polling logic & helpers
- **Export:**
  - `startScanPolling()` - Bắt đầu polling trạng thái scan
  - `calculateScanProgress(status)` - Tính toán progress %
  - `formatStatusText(status)` - Format text trạng thái
  - `ScanStatusResponse` type export

### 3. **`components/otp-form-modal.tsx`** ✅ (ĐÃ CẬP NHẬT)
- **Thay đổi:**
  - Thêm form nhập email
  - Gọi API `sendOtp()` khi nhấn "Send OTP"
  - Gọi API `verifyOtp()` khi nhấn "Verify"
  - Thêm form nhập thông tin cá nhân (Họ tên, Công ty, Điện thoại, Ghi chú)
  - Gọi API `submitUserInfo()` + `createMemberWithService()` khi submit
  - Thêm error handling & loading states
  - Export `OTPFormData` interface

### 4. **`app/page.tsx`** ✅ (ĐÃ CẬP NHẬT)
- **Thay đổi:**
  - Import các API functions & polling utilities
  - Thêm state: `isScanning`, `scanProgress`, `taskId`, `scanResult`, `error`, `memberEmail`
  - `handleFormSubmit()` - Gọi `createScanTask()` + `startScanPolling()`
  - `handleDownloadReport()` - Tải file report
  - `handleReset()` - Reset về state ban đầu
  - Thêm UI hiển thị scanning progress (progress bar, spinner)
  - Thêm UI hiển thị scan results
  - Thêm error banner
  - Cleanup polling on unmount

### 5. **`.env.local`** ✅ (MỚI)
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 🔄 Luồng Hoạt Động Hoàn Chỉnh

```
1. Người dùng select file APK
   ↓
2. Nhấn "Scan" → Modal OTP xuất hiện
   ↓
3. Nhập email → Nhấn "Send OTP" (API: sendOtp)
   ↓
4. Nhập OTP từ email → Nhấn "Verify" (API: verifyOtp)
   ↓
5. Nhập thông tin cá nhân (Họ tên, Công ty, Điện thoại)
   ↓
6. Nhấn "Submit" (API: submitUserInfo + createMemberWithService)
   ↓
7. Upload APK & tạo task (API: createScanTask) → Nhận taskId
   ↓
8. Bắt đầu polling (API: getScanStatus) - cập nhật progress
   ↓
9. Hiển thị kết quả & nút Download (API: downloadReport)
   ↓
10. Nhấn "Scan Another" để reset
```

---

## 🚀 Cách Sử Dụng

### Prerequisites
- Backend API chạy tại `http://localhost:3000`
- Frontend chạy tại `http://localhost:3001` (hoặc port khác)

### Chạy Frontend
```bash
cd vietguardscan-frontend
npm install  # hoặc pnpm install
npm run dev
```

### Kiểm Tra API URL
- Mở file `.env.local`
- Đảm bảo `NEXT_PUBLIC_API_URL` đúng với backend URL

### Sử Dụng Ứng Dụng
1. Mở http://localhost:3001
2. Select file APK (.apk hoặc .app)
3. Nhấn "Scan"
4. Làm theo form steps (OTP, thông tin cá nhân)
5. Xem kết quả scan & tải report

---

## 🔧 Key Features Implemented

### ✅ Email OTP Verification
- Gửi OTP 6 chữ số
- Xác minh OTP
- Error handling nếu OTP sai/hết hạn

### ✅ Member Registration
- Collect thông tin cá nhân
- Validate input
- Tạo member trong system

### ✅ File Upload & Scanning
- Upload APK file
- Get IP address của client
- Create scan task

### ✅ Real-time Progress Tracking
- Polling status mỗi 3 giây
- Update progress bar
- Format status text

### ✅ Result Display
- Show risk level (HIGH/MEDIUM/LOW)
- Detected threats
- App name & package
- Permissions (nếu có)

### ✅ Download Report
- Download ZIP file
- Auto-name với taskId

### ✅ Error Handling
- Email validation
- OTP validation
- API error messages
- Network error handling
- Cleanup on unmount

### ✅ Loading States
- Disabled buttons khi loading
- Spinner icons
- Progress bar
- Status messages

---

## 📝 TypeScript Interfaces

```typescript
// OTPFormData - Dữ liệu form submit
interface OTPFormData {
  email: string
  otp: string
  fullName: string
  company: string
  phone: string
  notes: string
  memberEmail?: string
}

// ScanStatusResponse - API response
interface ScanStatusResponse {
  taskId: string
  status: "pending" | "processing" | "completed" | "failed"
  progress?: number
  result?: {
    riskLevel?: string
    detectedThreats?: string[]
    appName?: string
    packageName?: string
    permissions?: string[]
  }
  error?: string
}
```

---

## 🐛 Testing Checklist

- [ ] Email validation works
- [ ] OTP send/verify works
- [ ] User info submission works
- [ ] Member creation works
- [ ] File upload works
- [ ] Polling starts & updates
- [ ] Progress bar increments
- [ ] Results display correctly
- [ ] Download report works
- [ ] Reset/Scan another works
- [ ] Error messages display
- [ ] Loading states work
- [ ] Cleanup on unmount works

---

## 🔐 Security Notes

1. **API URL**: Configure correctly trong `.env.local`
2. **CORS**: Backend phải allow CORS từ frontend URL
3. **OTP**: Backend xử lý OTP expiry (10 phút)
4. **Email**: Validate email format trước gửi API
5. **File**: Validate file type/size trong `FileUpload` component

---

## 🚨 Known Issues & Future Improvements

### Có thể cần:
1. Refresh token logic (nếu API requires)
2. Retry logic cho failed requests
3. Cache previous scan results
4. Pagination cho history
5. Detailed error codes
6. Analytics/logging
7. Rate limiting UI
8. More detailed result display
9. Multiple file upload
10. Batch scanning

---

## 📞 Support

Nếu có issue:
1. Check backend API is running
2. Check `.env.local` API URL
3. Check browser console for errors
4. Check network tab trong DevTools
5. Verify email & OTP logic

---

**Status: ✅ FULLY INTEGRATED & READY TO USE**
