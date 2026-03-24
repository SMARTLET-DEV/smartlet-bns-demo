Requirement:
 When a user visits a property details page through a QR code scan, the system should increase the visit count for that property.
Integration:
On the property details page:
Check if the query parameter ?qrCode=true exists in the page URL.
If present, call the API:
 PATCH /api/properties/:id/qr-visit
This increments the QR visit count for that property.
APIs used in Frontend:
Increment QR Visit Count: PATCH /api/v1roperties/qr-visit

