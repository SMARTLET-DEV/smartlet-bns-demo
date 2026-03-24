An overview of the new File Sharing System in simpler words
This is a stand-alone file-sharing system inside smartLET Admin panel, meant for letting agents to collect documents from renters and share those documents with homeowners.

It works through secure, time-limited links that are generated inside the admin interface.
1. There are TWO types of links generated
A. Upload Link (for renters to upload documents)
Example:
smartlet.com.bd/renter-document-upload/:uploadToken
Generated manually by a letting agent inside the admin panel.


Each link has a unique token.


Valid for 6 hours only.


Public renter opens the link → uploads files → submits.


After successful upload:


Link becomes invalid permanently.


Renter cannot re-edit or re-upload.


Session status becomes UPLOADED.


B. View-Only Link (for homeowners to see the uploaded docs)
Example:
 smartlet.com.bd/view-tenant-document/:viewToken
Automatically generated together with the upload link.


Initially disabled (invisible to homeowner).


After renter uploads → letting agent/admin can enable the view link.


When enabled, admin can:


Turn visibility ON/OFF.


When turned ON → link is valid for 6 hours.


After expiry → admin must re-enable visibility again to regenerate another 6 hours.


2. Admin-side interface (letting agent interface)
Letting agent sees a dedicated module:
A. Generate New Link button
Creates a “document upload session” with:
A new uploadToken link


A new viewToken link (disabled initially)


Expiry time for upload (6 hours)


Status = PENDING_UPLOAD


B. Table of all previously generated links
Each row shows:
Label/Title (optional)


Created by which agent


Upload link expiry time


View link visibility (ON/OFF)


View link expiry time


Status:


PENDING_UPLOAD


UPLOADED


EXPIRED


Uploaded file count


Actions:


Copy upload link


Copy view link


Toggle view visibility


View details


This module is independent (doesn’t depend on property, rental application, etc.).
3. Public renter upload interface
When renter opens the upload link:
Backend validates uploadToken:


Must exist


Must not be expired


Must be PENDING_UPLOAD


Shows renter a simple UI to upload documents.


After upload:


Files stored in S3


Session status becomes UPLOADED


Upload URL becomes invalid permanently



4. Public homeowner view-only interface
When homeowner opens the view link:
Backend checks:


Token exists


viewEnabled = true


viewExpiresAt > now


Session status = UPLOADED


If conditions pass:
The homeowner sees the documents (presigned URLs).


If link expired or disabled → shows "Access restricted / expired."


5. Security Rules
Upload link expiration = hard 6 hours


Upload link becomes dead after first successful upload.


View-only link can be:


Enabled/disabled anytime by admin


When enabled → valid for 6 hours


Expired link doesn’t expose files


Tokens are long cryptographically secure strings.


No login required for public users (token itself acts as key).


6. This is an independent module
Does NOT tie into other modules.
In short
A temporary secure document collection & sharing system where:
Letting agent generates upload link → renter uploads → admin controls visibility of a view-only link → homeowner views docs.

