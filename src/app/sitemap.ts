import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const staticEntries: MetadataRoute.Sitemap = [
        {
            url: 'https://opendoor.com.bd',
            lastModified: new Date(),
        },
        {
            url: 'https://opendoor.com.bd/blogs',
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: 'https://www.opendoor.com.bd/about-us',
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: 'https://www.opendoor.com.bd/contact',
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: 'https://www.opendoor.com.bd/faq',
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: 'https://www.opendoor.com.bd/home-inspection',
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: 'https://www.opendoor.com.bd/how-it-works-renter',
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: 'https://www.opendoor.com.bd/how-it-works-owner',
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: 'https://www.opendoor.com.bd/privacy-policy',
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: 'https://www.opendoor.com.bd/smartmove',
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: 'https://www.opendoor.com.bd/smartview',
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: 'https://www.opendoor.com.bd/terms-and-conditions',
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: 'https://www.opendoor.com.bd/why-choose-opendoor',
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let blogsEntries: MetadataRoute.Sitemap = [];
    let propertiesEntries: MetadataRoute.Sitemap = [];

    if (BASE_URL) {
        try {
            const response = await fetch(`${BASE_URL}/blogs`);
            const blogs = await response.json();
            if (blogs?.data?.blogs) {
                blogsEntries = blogs.data.blogs.map((item: { slug: string; updatedAt: string }) => ({
                    url: `https://opendoor.com.bd/blogs/${item.slug}`,
                    lastModified: new Date(item.updatedAt),
                    changeFrequency: "monthly" as const,
                    priority: 0.9,
                }));
            }
        } catch {
            // API unreachable at build time; use static entries only
        }
        try {
            const propertiesResponse = await fetch(`${BASE_URL}/properties`);
            const properties = await propertiesResponse.json();
            if (properties?.data?.properties) {
                propertiesEntries = properties.data.properties.map((item: { id: string; updatedAt: string }) => ({
                    url: `https://opendoor.com.bd/properties/${item.id}`,
                    lastModified: new Date(item.updatedAt),
                    changeFrequency: "monthly" as const,
                    priority: 0.9,
                }));
            }
        } catch {
            // API unreachable at build time; use static entries only
        }
    }

    return [...staticEntries, ...blogsEntries, ...propertiesEntries];
}