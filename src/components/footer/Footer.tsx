import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import FooterLink from "../common/FooterLink";
import ScrollToTopButton from "./ScrollToTopButton";
import SocialIcons from "./SocialIcons";

type FooterLinkType = {
    header: string;
    link: {
        name: string;
        href: string;
        disabled?: boolean;
    }[];
};

const footerLinks: FooterLinkType[] = [
    {
        header: "Company",
        link: [
            { name: "About OPENDOOR", href: "/about-us" },
            // { name: "Contact Us", href: "/contact" },
            { name: "Privacy Policy", href: "/privacy-policy" },
            { name: "Terms & Conditions", href: "/terms-and-conditions" },
            { name: "Careers", href: "/career" },

        ],
    },
    {
        header: "Our Services",
        link: [
            {
                name: "Home Inspection",
                href: "/home-inspection",
                // disabled: true,
            },
            { name: "PropertySnapper", href: "#", disabled: true },
            // { name: "Home Rental", href: "/properties?page=1&take=12&filter[propertyType][eq]=RESIDENTIAL&orderBy=-createdAt&filter[viewStatus][eq]=APPROVED&filter[isVisible][eq]=true&filter[isPaused][eq]=false&filter[createdAt][gt]=2023-01-01T00%3A00%3A00Z" },
            // { name: "Commercial Rental", href: "#", disabled: true },
        ],
    },
    {
        header: "Explore",
        link: [
            { name: "Blogs", href: "/blogs" },
            { name: "FAQs", href: "/faq" },
            { name: "smartVIEW", href: "/smartview" },
        ],
    },
    {
        header: "Locations",
        link: [
            { name: "Gulshan 1", href: "/residential/apartments-for-rent-in-gulshan-1" },
            { name: "Gulshan 2", href: "/residential/apartments-for-rent-in-gulshan-2" },
            { name: "Banani", href: "/residential/apartments-for-rent-in-banani" },
            { name: "Baridhara", href: "/residential/apartments-for-rent-in-baridhara" },
            { name: "Bashundhara", href: "/residential/apartments-for-rent-in-bashundhara" },
            { name: "Dhanmondi", href: "/residential/apartments-for-rent-in-dhanmondi", disabled: true },
            { name: "Uttara", href: "/residential/apartments-for-rent-in-uttara", disabled: true },
        ],
    },
];

export default function Footer() {
    const [date] = useState(new Date());
    const pathname = usePathname();
    const isCareerPage = pathname.startsWith("/career");

    return (
        <div
            className="text-black pt-10 w-full relative"
            style={{
                backgroundColor: isCareerPage ? "#ffffff" : "whitesmoke",
            }}
        >
            <div className="container mx-auto px-5">
                <div className="flex flex-col relative border-b border-gray-300 lg:pb-7 pb-3">
                    <div className="grid lg:grid-cols-5 sm:grid-cols-2 w-full gap-6">
                        <div className="flex flex-col text-muted border-b sm:border-b-0 border-gray-300 pb-7">
                            <Link href="/" className="w-fit h-fit">
                                <div className="w-42 h-fit">
                                    <Image
                                        src="/logos/sL Logo Font.png"
                                        alt="SmartLET Logo"
                                        width={168}
                                        height={48}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </Link>
                            <p className="mt-8">45 Kemal Ataturk Avenue</p>
                            <p>Banani, Dhaka-1213</p>
                            <p className="mt-4">
                                <span>info@opendoor.com.bd</span>
                            </p>
                            <p className="mt-0">
                                <span>09666 721 521</span>
                            </p>
                            <div className="mt-6">
                                <p className="font-normal">Open Hours:</p>
                                <p className="mt-2">Weekdays - 10am to 8pm</p>
                                <p className="mt-0 whitespace-nowrap">Weekends - by appointment only</p>
                            </div>
                            <div className="mt-5 lg:hidden">
                                <SocialIcons />
                            </div>
                        </div>

                        {/* Company Section */}
                        <div className="flex flex-col w-fit lg:mx-auto">
                            <h3 className="text-black font-normal">
                                {footerLinks[0].header}
                            </h3>
                            <ul className="flex flex-col gap-2 mt-3">
                                {footerLinks[0].link.map((item, idx) => (
                                    <li key={item.name}>
                                        <FooterLink {...item} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Our Services and Explore Section */}
                        <div className="flex flex-col w-fit lg:mx-auto">
                            <h3 className="text-black font-normal">
                                {footerLinks[1].header}
                            </h3>
                            <ul className="flex flex-col gap-2 mt-3">
                                {footerLinks[1].link.map((item, idx) => (
                                    <li key={item.name}>
                                        <FooterLink {...item} />
                                    </li>
                                ))}
                            </ul>

                            {/* Explore below Our Services */}
                            <h3 className="text-black font-normal mt-6">
                                {footerLinks[2].header}
                            </h3>
                            <ul className="flex flex-col gap-2 mt-3">
                                {footerLinks[2].link.map((item, idx) => (
                                    <li key={item.name}>
                                        <FooterLink {...item} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Locations Section */}
                        <div className="flex flex-col w-fit lg:mx-auto">
                            <h3 className="text-black font-normal">
                                {footerLinks[3].header}
                            </h3>
                            <ul className="flex flex-col gap-2 mt-3">
                                {footerLinks[3].link.map((item, idx) => (
                                    <li key={item.name}>
                                        <FooterLink {...item} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Social + scroll */}
                        <div className="flex flex-col w-fit ms-auto">
                            <div className="lg:flex hidden">
                                <SocialIcons />
                            </div>
                            <div className="mt-auto">
                                {/* <ScrollToTopButton /> */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="my-3 container mx-auto">
                    <p className="text-black opacity-50 font-thin">
                        © {date.getFullYear()} OPENDOOR Ltd. | All rights
                        reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
