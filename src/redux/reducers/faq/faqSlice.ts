import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FaqCategory = "general" | "services" | "registration" | "rental" | "webapp";

type FaqItem = {
  question: string;
  answer: string;
};

type SubCategory = {
  id: string;
  title: string;
  faqs: FaqItem[];
};

type FaqData = {
  [key in FaqCategory]: {
    title: string;
    subcategories: SubCategory[];
  };
};

interface FaqState {
  selectedCategory: FaqCategory;
  faqData: FaqData;
}

const initialState: FaqState = {
    selectedCategory: "general",
    faqData: {
        general: {
            title: "Getting Started",
            subcategories: [
                {
                    id: "A",
                    title: "Getting Started",
                    faqs: [
                        {
                            question: "What is OPENDOOR?",
                            answer:
                "OPENDOOR is a rental solutions platform for both homeowners and tenants. It serves as a one-stop solution for listing, discovering, and renting residential and commercial properties.",
                        },
                        {
                            question: "How is OPENDOOR different?",
                            answer: `OPENDOOR offers a first of its kind end to end process bringing convenience in the rental journey for both tenants and owners. Tenants can easily discover verified listings, receive curated suggestions, attend guided viewings led by letting experts, and complete applications and agreements through one standardized process. Property owners benefit from high quality listings, tenant screening, expert-led negotiations and faster tenant placement.

OPENDOOR introduces smartVIEW , a completely new way of viewing properties online, which enhances decision-making through HDR images, 3D floor plans, virtual tours, and all the amenities a property has to offer, allowing tenants to understand a property clearly while helping owners showcase their properties with the best digital presence.`,
                        },
                        {
                            question: "Which areas does OPENDOOR currently have properties in?",
                            answer:
                "OPENDOOR is currently operational in Banani, Gulshan, Baridhara, Bashundhara, Dhanmondi, Uttara, and Niketan.",
                        },
                        {
                            question: "Is OPENDOOR only for residential rentals?",
                            answer:
                "No. OPENDOOR facilitates both residential and commercial property rentals within its operational areas.",
                        },
                        {
                            question: "How do you help tenants get a rental?",
                            answer:
                "Every tenant request is handled by OPENDOOR's customer support team, who curate and share personalized property options based on the tenant's requirements. Viewings are guided by trained letting experts, who also assist with negotiating fair terms and preparing clear tenancy agreements - right through to move-in and key handover. OPENDOOR supports the entire rental journey, from search to move-in, all in one place.",
                        },
                        {
                            question: "How do I get started with OPENDOOR?",
                            answer:
                "You can start searching properties without even logging in! But to request a viewing or list a property, simply sign up using your email.",
                        },
                        {
                            question: "Is OPENDOOR free to use?",
                            answer:
                "Yes. OPENDOOR is completely free to use for tenants, including browsing, booking viewing appointments to finalizing and moving into a property.",
                        },
                        {
                            question: "Who can use OPENDOOR?",
                            answer:
                "OPENDOOR can be used by anyone looking to rent a property or list one for rent, including both residential and commercial spaces.",
                        },
                    ],
                },
            ],
        },
        services: {
            title: "Property Listings",
            subcategories: [
                {
                    id: "A",
                    title: "Property Listings",
                    faqs: [
                        {
                            question: "How do I search for properties on OPENDOOR?",
                            answer:
                "Search properties like never before using our powerful search bar. Select your preferred area and refine results with advanced filters such as budget, number of rooms, furnishing status, and amenities like gyms or swimming pools. You can also switch between residential and commercial listings from the top navigation.",
                        },
                        {
                            question: "How do I know if a property is available?",
                            answer:
                "A property is available as long as it does not show a \"LET AGREED\" status on the listing. This indicates whether the property is still open for applications.",
                        },
                        {
                            question: "What does \"LET AGREED\" mean?",
                            answer:
                "\"LET AGREED\" indicates that the property is either under agreement discussion with another tenant or has already been rented, and is no longer accepting applications.",
                        },
                        {
                            question: "Can I instantly view a property?",
                            answer:
                "OPENDOOR does not encourage instant or walk-in viewings. We recommend scheduling appointments a few hours in advance to ensure proper coordination and a smooth viewing experience.",
                        },
                        {
                            question: "How can I book an appointment?",
                            answer:
                "Click on the \"Request Viewing\" button on the property listing. You must be logged in to select a preferred time, after which a OPENDOOR letting expert will contact you to confirm.",
                        },
                        {
                            question: "Can I book property viewings through OPENDOOR?",
                            answer:
                "Yes. All property viewings are booked directly through the OPENDOOR web app using the \"Request Viewing\" option on the listing.",
                        },
                        {
                            question: "Why is the exact property location not disclosed on the listing page?",
                            answer:
                "Exact property locations are not publicly displayed due to privacy policies. Once your viewing request is confirmed, the letting expert will share the location details with you.",
                        },
                        {
                            question: "Can I get a number to contact for inquiries?",
                            answer:
                "Yes. You can call us at 09666721521 or WhatsApp us at 01335-445544 for any questions or assistance.",
                        },
                    ],
                },
            ],
        },
        registration: {
            title: "Tenants & Applications",
            subcategories: [
                {
                    id: "A",
                    title: "Tenants & Applications",
                    faqs: [
                        {
                            question: "How do I apply to rent a property through OPENDOOR?",
                            answer:
                "Log in as a tenant and click the \"Apply for Rent\" button on the property listing. Follow the guided steps and upload the required documents for verification.",
                        },
                        {
                            question: "Can I apply for more than one property at the same time?",
                            answer:
                "Yes, you may apply for multiple properties simultaneously. However, you can only be approved for and proceed with one property at a time.",
                        },
                        {
                            question: "What documents are required for the rental application?",
                            answer:
                "We require identity verification documents, such as a valid National ID or passport, along with financial eligibility documents. These may include recent bank statements, an employment or salary certificate, or any other officially accepted document that demonstrates financial eligibility.",
                        },
                        {
                            question: "How long does the approval process take?",
                            answer:
                "The approval process usually takes up to 24 hours. Once approved, you will be notified on your dashboard and contacted by a OPENDOOR letting expert.",
                        },
                        {
                            question: "Are the rents shown on OPENDOOR negotiable?",
                            answer:
                "The listed rent reflects the property owner's latest asking price for full transparency. But during the discussion of tenancy terms, a OPENDOOR letting expert will negotiate on your behalf to secure the fairest deal possible, aligned with current market rates.",
                        },
                        {
                            question: "Does OPENDOOR assist with rent negotiation?",
                            answer:
                "Yes. OPENDOOR handles negotiations between tenants and property owners, communicating the final outcome and any possible adjustments, so you can avoid any uncomfortable conversations.",
                        },
                        {
                            question: "How is the tenant protected through the agreement?",
                            answer:
                "Tenants are protected with guarantees such as receiving a move-in ready apartment, and clear terms to avoid disputes with homeowners.",
                        },
                        {
                            question: "Are there any service fees for tenants?",
                            answer:
                "No. OPENDOOR does not charge any service fees to tenants.",
                        },
                        {
                            question: "Is my personal information secure?",
                            answer:
                "Yes. All documents submitted to OPENDOOR are encrypted, password-protected, and automatically expire after six hours to ensure complete privacy.",
                        },
                    ],
                },
            ],
        },
        rental: {
            title: "Homeowners & Listings",
            subcategories: [
                {
                    id: "A",
                    title: "Homeowners & Listings",
                    faqs: [
                        {
                            question: "How do I list my property on OPENDOOR?",
                            answer:
                "Log in as a homeowner and request a listing appointment through the web app. A OPENDOOR representative will contact you to confirm and schedule the visit.",
                        },
                        {
                            question: "What does the listing process include?",
                            answer:
                "Our listing team captures professional HDR images, a 3D virtual tour, and a detailed floor plan during the appointment to ensure the best-quality listings available in the industry.",
                        },
                        {
                            question: "How long does it take for my property to go live?",
                            answer:
                "Your property is typically published within 24 hours after the listing appointment is completed.",
                        },
                        {
                            question: "Can I list multiple properties on OPENDOOR?",
                            answer:
                "Yes. Homeowners can list multiple properties and include both residential and commercial listings under the same account.",
                        },
                        {
                            question: "Does OPENDOOR help with rental agreements?",
                            answer:
                "Yes. OPENDOOR provides standardized rental agreements with all necessary clauses to protect both homeowners and tenants throughout the rental process.",
                        },
                        {
                            question: "How are rental payments managed?",
                            answer:
                "Payments are made securely through OPENDOOR's secure digital payment system after both parties approve of the conditions of the agreement and before signing the rental agreement.",
                        },
                    ],
                },
            ],
        },
        webapp: {
            title: "After-Rental Services",
            subcategories: [
                {
                    id: "A",
                    title: "After-Rental Services",
                    faqs: [
                        {
                            question: "What happens if there is a dispute?",
                            answer:
                "OPENDOOR minimizes disputes through tenant and homeowner verification, and the rental agreement serves as a legal reference. In case of issues, our team assists with dispute resolution with any clauses that falls under the tenancy agreement.",
                        },
                        {
                            question: "Does OPENDOOR provide post-rental or after-move-in support?",
                            answer:
                "Yes. A dedicated letting expert manages each case and provides ongoing support to tenants and homeowners even after the property is rented.",
                        },
                        {
                            question:
                "After the rental agreement is signed, whom do I contact for any queries regarding the property?",
                            answer:
                "After signing, routine property matters are handled by the building manager or the property owner's designated contact. However, for anything covered under the tenancy agreement where OPENDOOR's support is required, your assigned OPENDOOR letting expert will assist you and ensure the issue is resolved.",
                        },
                        {
                            question: "Can OPENDOOR help with deposit disputes?",
                            answer:
                "Yes. Security deposits are covered in the tenancy agreement, and if a dispute arises, such as non-refund, or incorrect adjustment, your assigned OPENDOOR letting expert will assist in resolving the issue according to the agreement as the agreement clause serves as a legal reference.",
                        },
                        {
                            question:
                "What happens if the property owner has not made the property move-in ready?",
                            answer:
                "If the property is not move-in ready as agreed, your assigned OPENDOOR letting expert will coordinate with the property owner to ensure all necessary repairs, cleaning, or preparations are completed before you take possession, protecting your rights as a tenant.",
                        },
                    ],
                },
            ],
        },
    },
};

const faqSlice = createSlice({
    name: "faq",
    initialState,
    reducers: {
        setSelectedCategory: (state, action: PayloadAction<FaqCategory>) => {
            state.selectedCategory = action.payload;
        },
    },
});

export const { setSelectedCategory } = faqSlice.actions;
export default faqSlice.reducer;
