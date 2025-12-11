# 🚀 Quick Reference - VietGuardScan Frontend Integration

## 📁 Files Created/Modified

```
vietguardscan-frontend/
├── lib/api/
│   └── scanService.ts              ✅ NEW - API wrapper (324 lines)
├── lib/utils/
│   └── pollingScan.ts              ✅ NEW - Polling logic (95 lines)
├── components/
│   └── otp-form-modal.tsx          ✅ UPDATED - OTP + Member form (353 lines)
├── app/
│   └── page.tsx                    ✅ UPDATED - Main scan page (314 lines)
├── .env.local                      ✅ NEW - Environment config
├── INTEGRATION_GUIDE.md            ✅ NEW - Full guide
└── IMPLEMENTATION_SUMMARY.md       ✅ NEW - Summary
```

---

## 🔑 Key APIs Used

```typescript
// From scanService.ts
sendOtp(email)                           // POST /api/members/send-otp
verifyOtp(email, otp)                   // POST /api/members/verify-otp
submitUserInfo(request)                 // POST /api/members/submit-info
createMemberWithService(request)        // POST /api/members/create-with-service
createScanTask(name, file, ip)          // POST /api/service/app-total-go
getScanStatus(taskId)                   // GET /api/service/app-total-go/status/{id}
downloadReport(taskId, fileName)        // GET /api/service/app-total-go/files/{id}
getClientIp()                           // GET https://api.ipify.org
```

---

## 🎯 Main Components & Functions

### OTPFormModal (`components/otp-form-modal.tsx`)
```typescript
interface OTPFormData {
  email: string
  otp: string
  fullName: string
  company: string
  phone: string
  notes: string
  memberEmail?: string
}

// Flow:
// 1. sendOtp() → Show OTP input
// 2. verifyOtp() → Show user info form
// 3. submitUserInfo() + createMemberWithService() → onSubmit()
```

### Main Page (`app/page.tsx`)
```typescript
// States:
isScanning, scanProgress, scanStatus
taskId, scanResult, error, memberEmail

// Handlers:
handleFileSelect()      // User select file
handleScan()           // Show OTP modal
handleFormSubmit()     // Upload + start polling
handleDownloadReport() // Download results
handleReset()          // Reset everything
```

### Polling (`lib/utils/pollingScan.ts`)
```typescript
startScanPolling({
  taskId,
  onStatusUpdate,    // Update progress
  onSuccess,         // Scan complete
  onError,          // Error handling
  intervalMs,       // Poll every 3s (default)
  maxAttempts       // Max 300 attempts (15 min)
})
// Returns cleanup function
```

---

## 🔄 User Flow

```
User selects APK file
        ↓
Click "Scan" button
        ↓
OTP Form Modal opens
        ↓
Enter email → Send OTP
        ↓
Enter OTP → Verify
        ↓
Enter user info (Name, Company, Phone)
        ↓
Click "Submit"
        ↓
Upload APK + Create member
        ↓
Start polling for status (every 3s)
        ↓
Progress bar updates
        ↓
Status = "completed"
        ↓
Display results:
- Risk Level
- Threats
- App info
        ↓
Click "Download Report"
        ↓
File downloaded as ZIP
```

---

## ⚡ Quick Start

### 1. Start Backend
```bash
cd vietguardscan-backend
npm install
npm run start
# Backend runs on http://localhost:3000
```

### 2. Start Frontend
```bash
cd vietguardscan-frontend
npm install
npm run dev
# Frontend runs on http://localhost:3001
```

### 3. Test Scan
1. Go to http://localhost:3001
2. Upload APK file
3. Fill OTP form
4. Watch scan progress
5. Download report

---

## 📊 State Management

```typescript
// File selection
selectedFile: File | null

// Modal
isModalOpen: boolean

// Scanning
isScanning: boolean
scanProgress: number (0-100)
scanStatus: string

// Results
taskId: string | null
scanResult: ScanStatusResponse | null

// UI
error: string | null
memberEmail: string | null

// Polling cleanup
pollingCleanupRef: useRef
```

---

## 🛡️ Error Handling

```typescript
// Email validation
if (!emailRegex.test(email)) error

// OTP validation
if (otp.length !== 6) error

// Required fields
if (!name || !company || !phone) error

// API errors
try/catch on all API calls

// Polling timeout
maxAttempts = 300 → 15 minutes max
```

---

## 📱 UI Sections

### 1. Hero (Always visible)
```
Title: "VietGuardScan"
Subtitle: description
```

### 2. Error Banner (When error)
```
AlertCircle icon + error message
```

### 3. Upload Section
```
Conditional rendering:
- FileUpload component (not scanning, no result)
- Progress bar (scanning)
- Results + Download (completed)
```

### 4. Features (Always visible)
```
3 cards: Security, Speed, Reports
```

### 5. Stats (Always visible)
```
StatsCharts component
```

---

## 🔐 Security

```
✅ Email validation (regex)
✅ OTP expiry (backend 10 min)
✅ HTTPS ready (config in .env)
✅ Input sanitization (React)
✅ Error messages safe (no stack traces)
✅ Resource cleanup (on unmount)
```

---

## 🧪 Testing Checklist

- [ ] Send OTP works
- [ ] OTP verification works
- [ ] Invalid OTP error shows
- [ ] User info validation works
- [ ] File upload works
- [ ] Polling starts
- [ ] Progress bar updates
- [ ] Results display
- [ ] Download works
- [ ] Reset works
- [ ] Error messages appear
- [ ] Mobile responsive

---

## 📈 Monitoring

Watch browser console for:
```
✅ API calls in Network tab
✅ State changes in React DevTools
✅ Errors in Console
✅ Polling requests (every 3s)
✅ File upload progress
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to connect to API" | Check backend running on :3000 |
| "API URL not found" | Check .env.local NEXT_PUBLIC_API_URL |
| "OTP verification failed" | Check email in backend, verify OTP code |
| "File upload timeout" | Check network, increase timeout |
| "Progress stuck" | Check polling in Network tab |
| "Download not working" | Check browser console for errors |

---

## 📞 Support Files

- `INTEGRATION_GUIDE.md` - Detailed implementation guide
- `IMPLEMENTATION_SUMMARY.md` - Project overview
- This file - Quick reference

---

**Status: ✅ READY TO USE**
**Last Updated: 2025-12-05**
