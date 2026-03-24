import Link from "next/link";
import BeforeLogLayout from "./customLayouts/beforeLogLayout";

export default async function NotFound() {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-[80vh] px-4 sm:px-0">
                <h2 className="text-4xl font-normal text-primary mb-4 text-center">
                    Page Not Found
                </h2>
                <p className="text-base text-black mb-6 text-center">
                    This is either because the URL is incorrect or the page has been deleted.
                </p>
                <p>
                    <Link href="/" className="underline text-lg hover:text-primary transition-colors">
                        Go to Homepage
                    </Link>
                </p>
            </div>
        </>
    );
}
