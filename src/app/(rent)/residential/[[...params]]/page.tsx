"use client";

import BlogDetail from "@/components/blogcard/BlogDetail";
import ListingFilter from "@/components/listing-filter/ListingFilter";
import PropertiesContentContainer from "@/components/properties/propertiesCardItem";
import useScreenWidth from "@/hooks/useScreenWidth";
import { stripHtml } from "@/lib/utils";
import { useGetAllBlogsQuery } from "@/redux/reducers/blog/blogsApi";

export default function ResidentialPage() {
    const screenWidth = useScreenWidth();
    const isSmallScreen = screenWidth < 640;
    const sidePadding = isSmallScreen
        ? Math.max((screenWidth - 302) / 2, 12)
        : 24;

    const {
        data: blogData,
        isLoading: isBlogLoading,
        isError: isBlogError,
        error: blogError,
        refetch,
    } = useGetAllBlogsQuery({ skip: 0, take: 1 });

    if (isBlogError) {
        console.error("Error fetching blogs:", blogError);
    }

    const blog = blogData?.blogs?.[0];

    return (
        <>
            <div className="max-h-[52px]">
                <ListingFilter />
            </div>
            <div className="bg-background">
                <div
                    className={`w-full ${!isSmallScreen ? "pl-[24px] pr-0" : ""}`}
                    style={undefined}
                >
                    <PropertiesContentContainer />
                </div>
            </div>
            {/*  */}

            {blog && (
                <div>
                    <BlogDetail
                        src={
                            blog.thumbnail ||
              "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                        }
                        title={blog.title || "Untitled"}
                        date={
                            blog.createdAt
                                ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "Unknown date"
                        }
                        duration={
                            blog.readDuration
                                ? `${blog.readDuration} mins read`
                                : "5 mins read"
                        }
                        content={blog.shortDescription || "No content available"}
                        href={`/blogs/${blog.slug}`}
                    />
                </div>
            )}
        </>
    );
}
