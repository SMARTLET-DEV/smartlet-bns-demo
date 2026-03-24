Main Site Frontend - Renter Upload + Homeowner View
A. Overview
There are two public-facing flows on the main site:
Renter document upload page


URL: https://smartlet.com.bd/renter-document-upload/:uploadToken


Used by: Renter


Purpose: Upload files once; link expires in 6 hours or after upload.


Homeowner view page


URL: https://smartlet.com.bd/view-tenant-document/:viewToken


Used by: Homeowner / Landlord


Purpose: View/download renter’s uploaded documents via secure presigned links; viewing access is controlled by Admin.


The frontend will talk to backend public APIs:
Base: API_BASE_URL = https://api.smartlet.com.bd (example)


Upload flow endpoints:


GET /public/file-sharing/upload/:uploadToken


POST /public/file-sharing/upload/:uploadToken


View flow endpoint:


GET /public/file-sharing/view/:viewToken


B. Renter Upload Page
1. Route & URL
Next.js page:
 /renter-document-upload/[uploadToken].tsx
Example shared URL renters receive:
https://smartlet.com.bd/renter-document-upload/3e9c3d...a5f1

uploadToken is the path param and must be passed to the backend.
2. Page Flow
On page load


Read uploadToken from URL.


Call:
 GET ${API_BASE_URL}/public/file-sharing/upload/${uploadToken}


Possible outcomes


Valid link, still pending → Show upload UI.


Invalid or expired / already used → Show proper error message and hide upload form.



3. API: Get Upload Session Info
Request
GET /public/file-sharing/upload/:uploadToken

No auth headers.


uploadToken from the URL.


Successful Response (200)
{
  "success": true,
  "label": "Renter documents for Flat 5B, Banani",
  "notes": "Please upload NID (front & back) and latest bank statement."
}

label: Optional title for the session (can be shown as heading).


notes: Optional longer instruction text.


Error Responses
Status
Meaning
Example body
404
Invalid / unknown link
{ "success": false, "message": "Invalid upload link" }
410
Link expired or already completed
{ "success": false, "message": "Upload link expired" } or { "success": false, "message": "Upload already completed" }


4. UI Layout Suggestion
Basic structure:
Title:


Use label if present, else a default like:
 “Upload your documents”


Short description:


Use notes if present, else default:
 “Please upload the requested documents in PDF or image format.”


File input:


<input type="file" multiple />


Show list/preview of selected files (names, sizes).


Submit button:


“Upload documents”


States:


loading on initial GET


submitting on POST


success message after upload


error message for expired/invalid



5. API: Submit Upload
Request
POST /public/file-sharing/upload/:uploadToken
Content-Type: multipart/form-data
Field name: files

Use FormData.


Example (Fetch-style):


const formData = new FormData();
selectedFiles.forEach((file) => formData.append("files", file));

await fetch(
  `${API_BASE_URL}/public/file-sharing/upload/${uploadToken}`,
  {
    method: "POST",
    body: formData,
  }
);

Successful Response (200)
{
  "success": true,
  "message": "Documents uploaded successfully"
}

Error Responses
Status
Meaning
Example body
404
Invalid link
{ "success": false, "message": "Invalid upload link" }
410
Expired / already used
{ "success": false, "message": "Upload link expired" }
400
No files uploaded / malformed request
{ "success": false, "message": "No files uploaded" }

Frontend behavior
On success:


Show confirmation: “Your documents have been uploaded successfully.”


Optional: disable form / hide upload UI.


On 410 (expired/used):


Show “This upload link is no longer active. Please contact your agent.”


On 404:


Show “This upload link is invalid.”



C. Homeowner View Page
1. Route & URL
Next.js page:
 /view-tenant-document/[viewToken].tsx
Example shared URL:
https://smartlet.com.bd/view-tenant-document/f81ac2...c3d9

viewToken is path param.

2. Page Flow
On page load


Read viewToken from URL.


Call:
 GET ${API_BASE_URL}/public/file-sharing/view/${viewToken}


Possible outcomes


Valid + allowed + not expired → Show document list.


Docs not uploaded yet / access restricted / expired / invalid → Show proper error message.



3. API: View Documents
Request
GET /public/file-sharing/view/:viewToken

No auth headers.


Successful Response (200)
{
  "success": true,
  "label": "Renter documents for Flat 5B, Banani",
  "renterName": "Md. Rahim",
  "files": [
    {
      "id": "c8a3b3bd-3f1a-4a7e-a11e-9b8f4c3a4751",
      "fileName": "nid_front.jpg",
      "mimeType": "image/jpeg",
      "size": 243820,
      "url": "https://bucket.s3.region.amazonaws.com/..."
    },
    {
      "id": "f7e81c5a-69cc-4ca1-8989-0059d82311b5",
      "fileName": "bank_statement.pdf",
      "mimeType": "application/pdf",
      "size": 1203920,
      "url": "https://bucket.s3.region.amazonaws.com/..."
    }
  ]
}

url is a presigned S3 URL valid for ~10 minutes.


Frontend should simply use it in <a href={url} target="_blank"> or similar.


Error Responses
Status
Meaning
Example body
404
Invalid view link
{ "success": false, "message": "Invalid view link" }
400
Documents not uploaded yet
{ "success": false, "message": "Documents have not been uploaded yet" }
403
Admin has restricted visibility
{ "success": false, "message": "Access to these documents is restricted" }
410
View link expired
{ "success": false, "message": "View link has expired" }


4. UI Layout Suggestion
Title:


Use label if present.


Example: “Renter documents for Flat 5B, Banani”


Subtitle:


If renterName exists: “Submitted by: Md. Rahim”


List of documents:


Table or cards, each row:


File icon (optional, based on mimeType)


File name


File size (formatted, e.g. “1.2 MB”)


“View/Download” button linking to url


Empty state:


If files is empty (shouldn’t usually happen once UPLOADED), show: “No documents available.”


5. Token Lifetime & UX Notes
If user keeps the view page open for a long time, the presigned URLs may expire.


Simplest behavior:


If user clicks a link and it fails, you can show a toast: “This link may have expired, please refresh the page.”


A page refresh will trigger backend again and generate fresh presigned URLs (as long as the viewToken itself is still valid and visibility is on).

