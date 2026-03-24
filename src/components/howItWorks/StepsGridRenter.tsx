import StepsGrid from "@/components/howItWorks/StepsGrid";
import StepsGridMobile from "@/components/howItWorks/StepsGridMobile";

const renterSteps = [
    {
        id: "create-account",
        title: "Create Your Account",
        subtitle: "Sign up to get started instantly.",
        image: "/how-it-works/image-1.png",
    },
    {
        id: "search-properties",
        title: "Search for Properties",
        subtitle: "Find your perfect match with powerful filters",
        image: "/how-it-works/image-2.png",

    },
    {
        id: "book-viewing",
        title: "Book A Viewing",
        subtitle: "Book appointment to get an in person viewing of the property.",
        image: "/how-it-works/image-3.png",

    },
    {
        id: "apply-rent",
        title: "Apply for Rent",
        subtitle: "No paperwork, just a few clicks",
        image: "/how-it-works/image-4.png",

    },
    {
        id: "pay-deposit",
        title: "Pay Deposit",
        subtitle: "Secure your new home by completing the deposit.",
        image: "/how-it-works/image-5.png",
    },
];

const renterStepsMobile = renterSteps.map((step, index) => ({
    number: index + 1,
    title: step.title,
    subtitle: step.subtitle,
    image: step.image,
}));

export default function StepsGridRenter() {

    return (
        <>
            <div className="lg:hidden">
                <StepsGridMobile steps={renterStepsMobile} />
            </div>
            <div className="hidden lg:block">
                <StepsGrid steps={renterSteps} />
            </div>
        </>
    );
}