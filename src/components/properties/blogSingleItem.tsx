"use client";
import { BlogCard } from "@/components/blogcard/BlogCard";
import { useGetSingleBlogQuery } from "@/redux/reducers/blog/blogsApi";
import { useIsMobile } from "@/hooks/useIsMobile";
import BlogDetail from "../blogcard/BlogDetail";

const BlogSingleItem = () => {
    const isMobile = useIsMobile();

    const {
        data: blogData,
        isLoading: blogLoading,
        isError: blogError,
        error,
    } = useGetSingleBlogQuery("23614430-c860-4038-bb78-084e388c5623");

    const blog = blogData?.blog;
    // console.log("mama blog",blog);

    if (blogLoading) {
        return (
            <div className="container mx-auto mt-10">
                <p>Loading blog...</p>
            </div>
        );
    }

    if (blogError) {
        return (
            <div className="container mx-auto mt-10">
                <p>Error loading blog{error?.message ? `: ${error.message}` : ""}</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="container mx-auto mt-10">
                <p>Blog not found.</p>
            </div>
        );
    }


    return (
        <div className="container mt-10">
            {/* <BlogCard
        variant={isMobile ? "default" : "large"}
        src={blog.media || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
        title={blog.title}
        date={
          blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Unknown date"
        }
        duration={blog.readDuration || "3 min read"}
        description={blog?.shortDescription || "No short description is available for this blog yet. Explore the full article to learn more!"}
        href={`/blogs/${blog.slug}`}
      /> */}
            <BlogDetail
                src={blog.media || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                title={blog.title}
                date={
                    blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                        : "Unknown date"
                }
                duration={blog.readDuration || "3 min read"}
                content={blog.shortDescription || "No content available"}
            />
        </div>
    );
};

export default BlogSingleItem;
