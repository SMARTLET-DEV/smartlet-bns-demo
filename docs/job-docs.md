Main Site Frontend Guide
Job Apply Flow (Job Details - Apply Modal)
This document explains how the Job Application flow should work on the public website, including UI behavior, field layout, UX ordering, validation, and API integration.
1. Entry Point
Trigger
On the Job Details page, there should be a primary CTA:
Button label:
 Apply for this job
Behavior
Clicking the button opens a modal (not a separate page)


Background page remains visible but locked


Modal width should match existing site modal standards


Mobile: modal opens as full-height bottom sheet


2. Modal Structure & UX Principles
Design Consistency
Use the same typography, spacing, button styles, and input components used elsewhere on the site


Avoid long forms visually; group fields logically


Clear primary CTA at the bottom


Minimal distractions


3. Modal Header
Header content:
Title: Apply for {Job Title}


Optional subtitle: {Company / Department} (if already shown elsewhere)


Close (X) icon on top right


4. Form Layout & Field Order (UX-Optimized)
The form should be presented in the following order for best completion rate.
Section 1: Personal Information
These fields should be shown first, as they are quick to fill and reduce drop-off.
Full Name (required)


Placeholder: Your full name


Single input field


Email Address (required)


Placeholder: you@example.com


Email validation required


Phone Number (required)


Placeholder: 01XXXXXXXXX


Allow international numbers if site supports it


Section 2: Professional Summary
Years of Experience (optional but recommended)


Input type: number


Placeholder: e.g. 3


Allow decimals (e.g. 2.5)


Skillset (optional)


Input type: tag input / multi-select


Placeholder: Add skills (press Enter)


Example values: Node.js, React, PostgreSQL


Internally sent as an array of strings


Section 3: Supporting Information
Cover Letter (optional)


Textarea


Placeholder:
 Write a short message about yourself or why you're a good fit


Character limit can be high (server allows large text)


Section 4: Links (Optional, Collapsible)
These fields can be shown normally or behind an “Add links (optional)” toggle.
Portfolio URL (optional)


LinkedIn Profile URL (optional)


GitHub Profile URL (optional)


All should validate as URLs.

Section 5: CV Upload (Required)
Upload CV (required)


Accept: PDF, DOC, DOCX


Max size: 10MB


Show selected file name


Replace file option available


Validation should happen before submit.
5. Hidden / System Fields
These should not be shown to the user but must be sent:
jobId → comes from the job details page context


6. Submit Button
Button label:
 Submit Application
Button behavior:
Disabled while submitting


Show loading state


Prevent double submission


7. Submit API Integration
Endpoint
POST /jobApplications/apply

Content Type
multipart/form-data

Example FormData Payload (Frontend)
const formData = new FormData();

formData.append("jobId", jobId);
formData.append("fullName", values.fullName);
formData.append("email", values.email);
formData.append("phone", values.phone);

if (values.yearsExperience !== undefined) {
  formData.append("yearsExperience", String(values.yearsExperience));
}

// ⚠️ IMPORTANT: Repeat skillset key for each value (NOT as JSON string)
// Example: if skills = ["Node.js", "React"], append "skillset" twice
values.skillset?.forEach((skill) => {
  formData.append("skillset", skill);
});

if (values.coverLetter) {
  formData.append("coverLetter", values.coverLetter);
}

if (values.portfolioUrl) {
  formData.append("portfolioUrl", values.portfolioUrl);
}

if (values.linkedinUrl) {
  formData.append("linkedinUrl", values.linkedinUrl);
}

if (values.githubUrl) {
  formData.append("githubUrl", values.githubUrl);
}

formData.append("cv", selectedFile);


Example Success Response
{
  "data": {
    "id": "app_123",
    "jobId": "job_456",
    "fullName": "Abdur Rahman",
    "firstName": "Abdur",
    "email": "rahman@gmail.com",
    "phone": "017XXXXXXXX",
    "yearsExperience": 3,
    "skillset": ["Node.js", "Prisma"],
    "status": "SUBMITTED",
    "createdAt": "2025-12-23T10:15:00Z"
  }
}


8. Success State (Post-Submit UX)
After successful submission:
Close the modal OR replace content with success state


Show confirmation message:


Suggested copy:
Your application has been submitted successfully.
 Our team will review it and contact you if there’s a match.
Provide a single button:


Close or Done


No redirect required.

9. Error Handling
Validation Errors
Show inline field errors


Do not reset filled fields


Server Errors
Show a non-technical message:


Something went wrong. Please try again later.


10. Notes for The Dev
Use multipart form submission


Do not attempt to upload CV separately


Do not construct S3 URLs manually


Skillset must be sent as JSON string or array


Keep the modal lightweight and fast


Ensure accessibility (labels, focus states)




Below is a **drop-in addition** you can append to the same document. It keeps the tone, structure, and developer focus consistent with the rest of your guide.

---

## 11. Job Listing – Get Request (Public Jobs Feed)

This section describes how the frontend should fetch **active job posts** to render the Jobs List page and to power the Job Details page.

---

### Endpoint

```
GET /jobPosts?isActive=true
```

---

### Purpose

* Fetch **all active job postings** for public display
* Used by:

  * Jobs Listing page
  * Job Details page lookup (via `slug`)
  * Source of `jobId` for the Apply modal

---

### Query Parameters

| Parameter | Type    | Required | Description                              |
| --------- | ------- | -------- | ---------------------------------------- |
| isActive  | boolean | Yes      | Only return jobs that are currently open |

Optional (if supported by backend later):

* `take` → pagination size
* `skip` → pagination offset
* `category`
* `location`

---

### Example Request (Frontend)

```ts
GET /jobPosts?isActive=true
```

---

### Example Response

```json
{
  "data": {
    "data": {
      "meta": {
        "total": 1,
        "take": 20,
        "skip": 0
      },
      "items": [
        {
          "id": "cmjk4t3eq0002p9l3rknd6muh",
          "slug": "frontend-engineer-react",
          "title": "Frontend Engineer (React)",
          "team": "Engineering",
          "jobCategory": "Software Development",
          "location": "Banani, Dhaka",
          "workMode": "Hybrid",
          "employmentType": "Full-time",
          "officeHours": "10AM – 6PM",
          "overview": "We are looking for a skilled Frontend Engineer (React)...",
          "responsibilities": [
            "Develop and maintain modern web applications using React"
          ],
          "qualifications": [
            "Bachelor’s degree in Computer Science or related field"
          ],
          "benefits": [
            "Competitive salary with performance-based increments"
          ],
          "salaryText": "৳ 80,000 BDT",
          "contactEmail": "careers@smartlet.com.bd",
          "applyInstruction": "Please send your updated CV...",
          "postedMonth": "December 2025",
          "isActive": true,
          "sortOrder": 0,
          "createdAt": "2025-12-24T14:51:13.922Z",
          "updatedAt": "2025-12-24T14:51:13.922Z"
        }
      ]
    }
  }
}
```

---

### Frontend Data Usage Mapping

#### Jobs Listing Page

Use the following fields:

* `title`
* `location`
* `employmentType`
* `workMode`
* `salaryText`
* `postedMonth`
* `slug` → for navigation
* `id` → internal reference

Example route:

```
/careers/frontend-engineer-react
```

---

#### Job Details Page

Use the job object (matched by `slug`) to populate:

* Job title
* Team / category
* Overview
* Responsibilities
* Qualifications
* Benefits
* Salary
* Work mode & employment type
* Office hours

⚠️ **Important**
Store `id` from this response as `jobId`.
This value must be sent as a hidden field when submitting the application.

---

### Apply Modal Integration

When user clicks **Apply for this job**:

* `jobId` comes from the selected job object
* `title` is used in the modal header:

  ```
  Apply for Frontend Engineer (React)
  ```

---

### Loading & Error States

**Loading**

* Show skeleton cards or spinner while fetching jobs

**Empty State**

* If `items.length === 0`:

  ```
  No open positions at the moment. Please check back later.
  ```

**Error State**

* Show generic message:

  ```
  Unable to load job openings. Please try again later.
  ```

---

### Notes for Dev

* Cache results where possible (jobs don’t change frequently)
* Do not expose inactive jobs publicly
* Always rely on `jobId` (not slug) for application submission
* Sorting can be done using `sortOrder` if needed
* Keep API calls lightweight and paginated for scale

---




