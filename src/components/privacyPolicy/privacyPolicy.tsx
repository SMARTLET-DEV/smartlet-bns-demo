"use client";

import TermsSection from "../termsAndConditions/termsSection";
import PrivacyIntro from "./privacyIntro";

export const privacyData = [
    {
        title: "a. Scope and Applicability",
        intro:
      "This Privacy Policy applies to all users of OPENDOOR’s services, including visitors to our website, registered renters, verified homeowners, vendors (e.g. SmartFix technicians), and any third party engaging with OPENDOOR through official communication or platform-based transactions. It governs all personal data collected through our website, mobile interfaces, digital forms, customer service engagements, and third-party integrations.",
    },
    {
        title: "b. Information We Collect",
        intro:
      "We collect information necessary to provide our services securely, legally, and effectively. This includes but is not limited to:",
        points: [
            "Personal identifiers such as full name, national ID (NID) or passport number, date of birth, and contact details.",
            "Property-related documents including ownership verification, tenancy agreements, and utility details.",
            "Financial information such as payment details, deposit records, income proofs, and mobile banking data (e.g., bKash, Nagad).",
            "Usage data including IP addresses, device and browser type, location data, session logs, and cookies.",
            "Communications history via calls, WhatsApp, email, in-app messaging, or platform-based submissions.",
            "Media content such as property photos, smartVIEW inspection footage, and walkthroughs.",
            "Employment information where applicable (e.g., for verifying renter eligibility).",
        ],
        outro:
      "All data is collected directly from users or authorized third parties, including verification partners, financial institutions, or maintenance vendors.",
    },
    {
        title: "c. Legal Basis for Processing",
        intro: "We process your personal data under the following lawful bases:",
        points: [
            "Contractual necessity – to deliver our letting and property management services.",
            "Legal obligations – to comply with applicable property, housing, and data protection laws.",
            "Legitimate interests – to enhance service quality, prevent fraud, and ensure secure transactions.",
            "Consent – for optional features such as marketing, promotions, or participation in surveys.",
        ],
        outro:
      "You may withdraw your consent at any time without affecting the legality of prior processing.",
    },
    {
        title: "d. Use of Information",
        intro: "Your data is used for the following purposes:",
        points: [
            "To verify your identity and eligibility as a renter or homeowner.",
            "To facilitate listings, inspections, smartVIEW publishing, and matching between renters and properties.",
            "To manage user accounts, service subscriptions, and communications.",
            "To process deposits, service charges, and refunds using integrated payment systems.",
            "To enable and document property inspections, SmartFix repairs, and dispute resolutions.",
            "To analyze platform performance, user behavior, and feedback for improving services.",
            "To detect and prevent fraud, unauthorized access, or policy violations.",
            "To fulfill legal reporting and regulatory obligations.",
        ],
        outro:
      "We may combine data across services for security, legal, or analytics purposes.",
    },
    {
        title: "e. Data Sharing and Disclosure",
        intro: "We do not sell, rent, or lease your personal data. However, we may disclose information in the following cases:",
        points: [
            "To verified homeowners and renters after agreement initiation, for lawful property rental facilitation.",
            "To third-party service providers including SmartFix technicians, inspection teams, or payment processors, under confidentiality obligations.",
            "To government agencies or law enforcement, if required under applicable law, court order, or investigation.",
            "To legal advisors, auditors, or insurance providers, as reasonably necessary for protection or enforcement of OPENDOOR's legal rights.",
            "In the case of a merger, acquisition, or business restructuring, with the successor entity assuming data responsibilities under this policy.",
        ],
        outro:
      "All partners and vendors are bound by non-disclosure agreements and must adhere to this Privacy Policy or equivalent standards.",
    },
    {
        title: "f. Cookies and Tracking Technologies",
        intro:
      "We use cookies, web beacons, and session-based tools to enhance user experience and improve platform functionality.",
        points: [
            "Cookies allow us to remember login credentials, tailor search preferences, and understand site usage trends.",
            "Analytical tracking (e.g., Google Analytics) helps us monitor traffic, conversion, and performance metrics.",
            "You may disable cookies via browser settings; however, doing so may limit access to certain features.",
        ],
        outro: "We do not use cookies for third-party behavioral advertising.",
    },
    {
        title: "g. Data Retention",
        intro: "We retain your data for as long as necessary to:",
        points: [
            "Provide services under your account or active listing.",
            "Comply with legal, accounting, or reporting obligations (e.g., tax or AML compliance).",
            "Resolve disputes, enforce agreements, or prevent fraud.",
        ],
        outro:
      "Inactive accounts are archived after 24 months of inactivity and permanently deleted or anonymized after 36 months, unless otherwise required by law.",
    },
    {
        title: "h. Data Security",
        intro: "We implement organizational, technical, and physical safeguards to protect user data:",
        points: [
            "Data is stored in secure servers with access limited to authorized personnel only.",
            "All financial transactions are encrypted using industry-standard SSL/TLS protocols.",
            "We conduct regular system audits, vulnerability assessments, and data access reviews.",
        ],
        outro:
      "Despite our efforts, no system is completely secure. Users are responsible for maintaining the confidentiality of their login credentials.",
    },
    {
        title: "i. User Rights",
        intro: "As a data subject, you are entitled to the following rights:",
        points: [
            "Right to Access – You may request a copy of the personal data held about you.",
            "Right to Correction – You may update inaccurate or incomplete information.",
            "Right to Deletion – You may request deletion of your data, subject to legal obligations.",
            "Right to Restriction – You may request limited processing under certain conditions.",
            "Right to Objection – You may object to data processing based on legitimate interests.",
            "Right to Withdraw Consent – You may withdraw your consent to non-essential processing at any time.",
        ],
        outro:
      "To exercise your rights, email us at privacy@opendoor.com.bd with appropriate identification.",
    },
    {
        title: "j. Children’s Data",
        intro:
      "OPENDOOR is not intended for use by minors under 18 years of age. We do not knowingly collect or process personal data from children. If you believe a minor has used our platform, please contact us, and we will delete the data.",
    },
    {
        title: "k. Third-Party Links and Integrations",
        intro: "OPENDOOR may include links or integrations with:",
        points: [
            "Third-party payment gateways (e.g., SSLCOMMERZ, bKash).",
            "Identity verification platforms.",
            "Property inspection or utility verification services.",
            "Social media platforms for login or promotion.",
        ],
        outro:
      "We are not responsible for the content, policies, or practices of external websites or services. We recommend reviewing their privacy policies before engaging.",
    },
    {
        title: "l. International Data Transfer",
        intro:
      "All data is processed and stored within Bangladesh. However, if OPENDOOR uses third-party tools or servers located abroad (e.g., cloud services), data may be transferred securely under applicable legal safeguards, including encryption and data handling agreements.",
    },
    {
        title: "m. Policy Updates and Notifications",
        intro:
      "We reserve the right to update this Privacy Policy at any time to reflect service improvements, legal requirements, or user feedback. Material changes will be notified via:",
        points: [
            "Email (if you have a registered account)",
            "Pop-up notifications on our website",
            "Updated “Last Revised” date at the top of this page",
        ],
        outro: "Continued use of the platform after changes signifies your acceptance.",
    },
    {
        title: "n. Governing Law and Jurisdiction",
        intro:
      "This Privacy Policy shall be governed by and construed in accordance with the laws of the People’s Republic of Bangladesh. Any disputes arising in connection with this policy shall be resolved exclusively by the competent courts of Dhaka.",
    },
    {
        title: "o. Contact Information",
        intro:
      "If you have any questions, concerns, or complaints about this Privacy Policy or your data, you may contact:",
        points: [
            "OPENDOOR Ltd.",
            "Email: support@opendoor.com.bd",
            "Phone: +880-1711994478",
        ],
    },
];

export default function PrivacyPolicy() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <h1 className="text-xl sm:text-2xl font-light mb-6">Privacy Policy</h1>
            <PrivacyIntro/>
            {privacyData.map((section, index) => (
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
