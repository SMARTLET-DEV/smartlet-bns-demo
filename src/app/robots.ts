import { MetadataRoute } from "next";

export default function robots():MetadataRoute.Robots{
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow:["/profile","/rented-property","/appointments","/favorites"]
        },
        sitemap: "https://opendoor.com.bd/sitemap.xml",
    }
}