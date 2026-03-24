import AppWrapper from "@/app/appWrapper";
import BlogDetailsPageContainer from "@/components/blogs/blogDetailsPageContainer";
import RelatedPostsSection from "@/components/blogs/relatedPostsSection";
import { fetchBlog } from "@/lib/api/blog";
import { fetchAllBlogs } from "@/lib/api/fetchAllBlogs";

interface Props {
  params: Promise<{ slug: string }>; // Type params as a Promise
}

export async function generateMetadata({ params }: Props) {
    try {
        let { slug } = await params;
        const blogData: any = await fetchBlog(slug);
        const blog = blogData?.data?.blog;

        // Handle missing blog data
        if (!blog) {
            return {
                title: "Blog Not Found | OPENDOOR",
                description: "The requested blog post could not be found.",
            };
        }

        // Safely handle potentially null/undefined fields
        const title = blog.title || "Blog Post";
        const description =
      blog.description ||
      blog.shortDescription ||
      "Blog post content not available";

        return {
            title: `${title} | OPENDOOR`,
            description: description.substring(0, 160),
            openGraph: {
                title: title,
                description: description.substring(0, 160),
                // images: [blog.media],
                url: `/blogs/${blog.slug}`,
            },
            alternates: {
                canonical: `/blogs/${blog.slug}`,
            },
        };
    } catch (error) {
        console.error("Error generating blog metadata:", error);
        return {
            title: "Blog | OPENDOOR",
            description: "Blog content",
        };
    }
}
export default async function BlogDetailsPage({ params }: Props) {
    let { slug } = await params;
    const blogData: any = await fetchBlog(slug);
    const blog = blogData?.data?.blog;

    const allBlogsData: any = await fetchAllBlogs();
    let blogsArr = allBlogsData?.data?.blogs || allBlogsData?.blogs || [];

    const relatedPosts = blogsArr
        .filter((item: any) => item.slug !== slug)
        .slice(0, 3) // show 3 related only
        .map((item: any) => ({
            id: item.id,
            image:
        item.thumbnail ||
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
            title: item.title,
            date: new Date(item.publishingDate || item.createdAt).toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }
            ),
            duration: `${item.readDuration || 5} mins read`,
            slug: item.slug,
            description: item.shortDescription,
        }));

    return (
        <>
            <main className="w-full container mx-auto space-y-5">
                <BlogDetailsPageContainer blog={blog} />
                <RelatedPostsSection posts={relatedPosts} />
            </main>
        </>
    );
}
