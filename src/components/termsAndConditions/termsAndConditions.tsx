"use client";

import TermsIntro from "./termsIntro";
import TermsSection from "./termsSection";

const termsData = [
  {
    title: "1. Definitions",
    points: [
      `“OPENDOOR”, “We”, “Us” refers to OPENDOOR Technologies Ltd.`,
      `“User", “You”, “Your” refers to any person accessing or using the Platform, including homeowners, renters, and service partners.`,
      `“Homeowner” refers to a user listing a property for rent on the Platform.`,
      `“Renter” refers to a user seeking to rent a listed property via the Platform.`,
      `“Property” means a residential or commercial space listed on OPENDOOR.`,
      `“smartVIEW” is OPENDOOR’s proprietary verified property profile and listing format`,
      `“Service Package” refers to any tiered offering (Basic, Smart, or Smart+) availed by a homeowner.`
    ],
  },
  {
    title: "2. Eligibility",
      intro: "You must be at least 18 years of age and capable of entering into legally binding contracts under Bangladeshi law to use this Platform. OPENDOOR may, at its sole discretion, refuse access or service to any person or entity at any time.",
  },
  {
    title: "3. Scope of Services",
    intro:"OPENDOOR offers an end-to-end letting agency solution including but not limited to:",
    points: [
      "Tenant/renter screening and verification",
      "Lease facilitation and documentation",
      "Property inspection and condition reporting",
      "Deposit collection and forwarding",
      "Rental reminders and follow-ups",
      "Digital communication between parties",
    ],
    outro:"Some services may vary based on the selected package and geographic location.",
  },
  {
    title: "4. Account Registration",
    intro: "To use many features of the Platform, you must register and create an account.",
    points: [
      "You are responsible for providing accurate, current, and complete information.",
      "You must maintain the confidentiality of your account credentials.",
      "You are responsible for all activity occurring under your account.",
    ],
    outro: "OPENDOOR reserves the right to suspend or terminate your account if any information provided is inaccurate or misleading.",
  },
  {
    title: "5. User Responsibilities",
    intro:"You agree to:",
    points: [
      "Use the Platform only for lawful purposes.",
      "Not engage in fraudulent, abusive, or misleading practices.",
      "Respect the rights and privacy of other users.",
      "Not attempt to damage, hack, or disrupt the Platform.",
    ],
  },
  {
    title: "6. Homeowner Obligations",
    intro: "Homeowners agree to:",
    points: [
      "Provide truthful and accurate information about listed properties.",
      "Disclose any known issues, defects, or disputes.",
      "Comply with all relevant housing laws and tenancy regulations.",
      "Honor agreements made through the Platform.",
    ],
    outro: "OPENDOOR is not responsible for any failure by a homeowner to fulfill obligations to renters."
  },
  {
    title: "7. Renter Obligations",
    intro: "Renters agree to:",
    points: [
      "Provide truthful information during screening and application.",
      "Honor lease terms agreed with homeowners.",
      "Treat the property with care and respect.",
      "Notify the homeowner or OPENDOOR promptly in case of issues.",
    ],
    outro: "Renters are responsible for any damage beyond normal wear and tear."
  },
  {
    title: "8. Listings",
    intro: "OPENDOOR offers a verified listing format that includes:",
    points: [
      "Verified photos, walkthroughs, and inspection reports",
      "Key utility and amenity details",
      "Transparent rent and deposit amounts",
    ],
    outro: "Although we strive to maintain accuracy, OPENDOOR is not liable for errors or outdated content in listings."
  },
  {
    title: "9. Tenant Screening & Verification",
    intro: "OPENDOOR conducts basic identity and financial eligibility checks for the peace of mind of homeowners.",
    points: [
      "This includes NID verification, income source verification, and basic background checks.",
      "OPENDOOR does not guarantee tenant behavior and shall not be held liable for any misconduct.",
    ],
  },
  {
    title: "10. Payments & Fees",
    points: [
      "Homeowners may be required to pay service charges based on their selected package.",
      "OPENDOOR may facilitate deposit collection and rental payment reminders but is not responsible for non-payment or disputes between renters and owners.",
      "All payments are to be made through the approved channels mentioned on the Platform.",
    ],
  },
  {
    title: "11. Cancellation & Refund Policy",
    points: [
      "Homeowners may cancel a listed service before activation; however, refunds are subject to administrative deductions.",
      "Renters may cancel applications; however, deposits already forwarded are non-refundable unless specified in the agreement with the homeowner.",
    ],
    outro: "OPENDOOR reserves the right to charge cancellation or penalty fees to cover operational costs."
  },
  {
    title: "12. Limitations of Liability",
    intro: "OPENDOOR acts solely as an intermediary between renters and homeowners. We are not a party to any rental contract.",
    points: [
      "We do not guarantee the suitability, safety, legality, or condition of listed properties.",
      "We are not liable for any financial or legal disputes arising between users.",
      "In no event shall OPENDOOR be liable for indirect, incidental, or consequential damages.",
    ],
  },
  {
    title: "13. Dispute Resolution",
    intro: "In case of disputes between renters and homeowners, OPENDOOR may offer mediation as a goodwill service but is not legally obliged to intervene.",
    outro: "For unresolved issues, parties are advised to seek redressal under applicable laws of Bangladesh."
  },
  {
    title: "14. Intellectual Property",
    intro: "All content on the Platform (design, text, graphics, logo, software) is the property of OPENDOOR or its licensors.",
    points: [
      "You may not copy, distribute, or exploit any content without our express written permission.",
    ],
  },
  {
    title: "15. Privacy and Data Protection",
    intro: "OPENDOOR collects and processes user data in accordance with our Privacy Policy. By using the Platform, you consent to such processing.",
    outro: "We take appropriate security measures to protect your data but cannot guarantee absolute security due to the nature of the internet."
  },
  {
    title: "16. Third-Party Services",
    intro: "OPENDOOR may link or integrate with third-party services (e.g., payment gateways, repair vendors).",
    points: [
      "We are not responsible for any content, service, or failure of these third parties."
    ],
  },
  {
    title: "17. Termination",
    intro: "OPENDOOR reserves the right to suspend or terminate your access to the Platform without prior notice for violations of these Terms.",
  },
  {
    title: "18. Amendments",
    intro: "We may update these Terms from time to time. Continued use of the Platform constitutes your acceptance of the revised Terms.",
    outro: "We recommend reviewing this page periodically."
  },
  {
    title: "19. Governing Law and Jurisdiction",
    intro: "These Terms are governed by the laws of the People’s Republic of Bangladesh. Any disputes shall be subject to the exclusive jurisdiction of the courts in Dhaka.",
  },
  {
    title: "20. Contact Us",
    intro: "For questions or concerns regarding these Terms, please contact:",
    points: [
      "OPENDOOR Ltd.",
      "Email: support@opendoor.com.bd",
      "Phone: +880-1711994478",
    ],
  },
];

export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-xl sm:text-2xl font-light mb-6">Terms and Conditions</h1>
      <TermsIntro />
      {termsData.map((section, index) => (
        <TermsSection
          key={index}
          title={section.title}
          intro={section.intro}
          points={section.points}
          outro={section.outro}
        />
      ))}
    </div>
  );
}
