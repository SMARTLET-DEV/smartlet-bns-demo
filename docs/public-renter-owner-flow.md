```md
# Main Site Frontend Implementation Guide  
## Public Renter / Owner Links

---

## 1) Overview

The main site exposes **public, password-protected flows** for two roles:

### Renter Flow
- Upload documents  
- Submit payment proof  
- (Optional) submit move-in info  
- Download invoice  

### Owner Flow
- View renter documents  
- Track status  
- Confirm payment received  
- Download invoice + payment confirmation  

### Base API Prefix
```

/api/v1

```

### Authentication Model
- **No login**
- Access is granted via:
  - Token in URL
  - Password in request header

### Password Header
```

x-rental-password: <password>

```

### Password Storage (Frontend)
- Store password in **browser session storage** after first successful access
- Attach password to **all subsequent requests** for that token

---

## 2) Public Routes and Page Structure

### 2.1 Renter Page

#### Frontend Route
```

/rental-process/renter/:token

```

#### Backend
```

GET /api/v1/rental-process/renter/:token

```

#### UI Layout Requirements
- Property summary card  
  - Title  
  - Address  
  - Area  
  - Rent  
  - Deposit months  
- Status timeline (single unified status)
- Step sections:
  - Document Upload
  - Payment Instruction (read-only)
  - Payment Proof Form
  - Invoice Download
  - Move-in Info Form

#### Initial Load Logic
1. Prompt for password if not found in session storage
2. Call:
```

GET /api/v1/rental-process/renter/:token

```
with `x-rental-password`
3. Error handling:
- Unauthorized → show password error and retry
- Expired/disabled → show:
  > “Link expired or disabled. Contact support.”

---

### 2.2 Owner Page

#### Frontend Route
```

/rental-process/owner/:token

```

#### Backend
```

GET /api/v1/rental-process/owner/:token

```

#### UI Layout Requirements
- Property summary card
- Minimal renter info (safe subset returned by API)
- Status timeline
- Sections:
  - View / download renter documents
  - Confirm received (visible only after payment confirmed)
  - Downloads (invoice + payment confirmation) after owner confirmation
  - Move-in info (read-only, if present)

---

## 3) Renter Actions and APIs

### 3.1 Upload Documents (ID + Business Card)

#### Endpoint
```

POST /api/v1/rental-process/renter/:token/documents

```

#### Request
- `multipart/form-data`

**Fields**
- `idDoc` (file)
- `businessCard` (file)

**Headers**
```

x-rental-password: <password>

````

#### UI Rules
- Show upload form **only when status allows**
- On success:
  - Refresh process via:
    ```
    GET /rental-process/renter/:token
    ```

---

### 3.2 Submit Payment Proof

#### Endpoint
````

POST /api/v1/rental-process/renter/:token/payment-proof

```

#### Request
- `multipart/form-data`

**Fields**
- `payerAccountNumber` (string)
- `depositDate` (date string)
- `amount` (number/string)
- `receipt` (file)

**Headers**
```

x-rental-password: <password>

```

#### UI Rules
- Show only after payment instruction is ready
- On success, refresh process data

---

### 3.3 Submit Move-in Info (Optional)

#### Endpoint
```

POST /api/v1/rental-process/renter/:token/move-in

```

#### Headers
```

x-rental-password: <password>
Content-Type: application/json

````

#### Body
```json
{
  "moveInDate": "2026-02-01",
  "note": "Will move in after painting is done"
}
````

---

### 3.4 Download Invoice / Receipt (Renter)

#### Endpoint

```
GET /api/v1/rental-process/renter/:token/download/:type
```

#### Type

* `INVOICE`
* `RECEIPT` (if applicable)

#### Headers

```
x-rental-password: <password>
```

#### UI Behavior

* Trigger browser download (file stream)
* **Do not** open S3 URLs directly

---

## 4) Owner Actions and APIs

### 4.1 View / Download Renter Documents

#### Secure File Streaming Endpoint

```
GET /api/v1/rental-process/:role/:token/files/:fileId
```

* `role` = `renter` or `owner`

#### Headers

```
x-rental-password: <password>
```

#### UI Behavior

* Process details response includes list of files with `fileId`
* Render documents with **View** and **Download** actions

---

### 4.2 Confirm Payment Received

#### Endpoint

```
POST /api/v1/rental-process/owner/:token/confirm-received
```

#### Headers

```
x-rental-password: <password>
```

#### UI Rules

* Show only when:

  * Payment is confirmed
  * Status is “awaiting owner received/dispatch”
* On success, refresh process

---

### 4.3 Download Invoice and Payment Confirmation (Owner)

#### Endpoints

```
GET /api/v1/rental-process/owner/:token/download/INVOICE
GET /api/v1/rental-process/owner/:token/download/PAYMENT_CONFIRMATION
```

#### Headers

```
x-rental-password: <password>
```

#### UI Behavior

* Enable only after owner confirmation
* Or based on backend status rules

---

## 5) Public Link Security (Frontend)

* Always send password via `x-rental-password`
* Never store password in long-term storage
* Use **session storage**

### Suggested Session Key

```
rental_password_<role>_<token>
```

### Required User States

* Invalid password → show retry prompt
* Expired token → “Link expired, contact support”
* Disabled link → “Link disabled, contact support”

> Rate limiting / brute-force protection is backend-driven
> UI must avoid infinite retries

---

## 6) File Sharing Module Replacement

The legacy file-sharing flow **must not be used**.

### Uploads

```
POST /rental-process/renter/:token/documents
POST /rental-process/renter/:token/payment-proof
```

### Downloads / Viewing

```
GET /rental-process/:role/:token/files/:fileId
GET /rental-process/*/:token/download/:type
```

* No direct S3 URL exposure

---

## 7) Coverage Confirmation (Main Site)

Using the provided public endpoints, the main site supports:

* Password-gated renter and owner pages
* Renter document upload
* Admin-driven status sync via GET process
* Read-only payment instruction display
* Renter payment proof upload
* Owner document view/download via secure streaming
* Owner payment received confirmation
* Generated PDF downloads (renter + owner)
* Move-in info submission and owner visibility

✅ **All stated public-flow requirements are covered**

```
```
