import NewsArticleContainer from "@/components/blogs/newsArticleContainer";
import WhyChooseSmartLET from "@/components/Features/WhyChooseOpendoor";
import FeaturedProperties from "@/components/properties/featuredProperties";
import FeaturedCommercialProperties from "@/components/properties/featuredCommercialProperties";
import HeaderContainer from "@/components/searchbox/headerContainer";
import SmartViewSection from "@/components/smartview/SmartViewSection";
import { TestimonialsSection } from "@/components/Testimonial/TestimonialsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "OPENDOOR",
    description:
    "Find, rent, and manage properties easily with OPENDOOR. Discover featured properties, testimonials, and more. Start your smart rental journey today!",
    metadataBase: new URL("https://opendoor.com.bd"),
    alternates: {
        canonical: "/",
    },
    verification: {
        google: "I1nywQn14q-oHO1csE0tD82JdvHwPdmjAjATNo1TcPE",
    },
    openGraph: {
        title: "OPENDOOR",
        description:
      "Find, rent, and manage properties easily with OPENDOOR. Discover featured properties, testimonials, and more. Start your smart rental journey today!",
        url: "https://opendoor.com.bd",
        siteName: "OPENDOOR",
        type: "website",
        locale: "en_US",
        images: [
            {
                url: "/og-image-v2.PNG",
                width: 1200,
                height: 1200,
                alt: "Browse featured properties on OPENDOOR",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "OPENDOOR",
        description:
      "Find, rent, and manage properties easily with OPENDOOR. Discover featured properties, testimonials, and more. Start your smart rental journey today!",
        images: ["/og-image-v2.PNG"],
    },
    keywords: [
        "OPENDOOR",
        "property rental Dhaka",
        "rent homes",
        "verified listings",
        "letting agency",
        "Bangladesh property",
    ],
};

export default function Home() {
    return (
        <main>
            {/* <header className="sr-only">
        <h1>OPENDOOR - Rent Smarter, Live Better</h1>
        <p>
          Find, rent, and manage properties easily with OPENDOOR. Discover featured
          properties, testimonials, and more. Start your smart rental journey today!
        </p>
        <nav>
          <ul>
            <li><a href="/properties">Browse Properties</a></li>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header> */}
            <HeaderContainer />
            <FeaturedProperties />
            <FeaturedCommercialProperties />
            <WhyChooseSmartLET />
            <SmartViewSection />
            <TestimonialsSection />
            <NewsArticleContainer />
        </main>
    );
}
