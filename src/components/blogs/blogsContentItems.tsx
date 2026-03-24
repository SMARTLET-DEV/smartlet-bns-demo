"use client";
import { SkeletonCard } from "@/components/ListingCard/SkeletonCard";

import { useGetAllBlogsQuery } from "@/redux/reducers/blog/blogsApi";
import { BlogCard } from "../blogcard/BlogCard";
import BlogLoadError from "./blogLoadError";
import { BlogCardSkeleton } from "../skeleton/BlogCardSkeleton";

const BlogsContentItems = () => {
  const {
    data: blogData,
    isLoading: isBlogLoading,
    isError: isBlogError,
    error: blogError,
    refetch,
  } = useGetAllBlogsQuery({ skip: 0, take: 10 });

  if (isBlogError) {
    console.error("Error fetching blogs:", blogError);
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center sm:place-items-stretch gap-3 space-y-4">
          {isBlogLoading ? (
            Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)
          ) : isBlogError ? (
            <BlogLoadError onRetry={() => refetch()} />
          ) : (
            blogData?.blogs?.map((blog: any) => (
              <BlogCard
                key={blog.id}
                src={
                  blog.thumbnail ||
                  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                }
                title={blog.title}
                date={new Date(blog.publishingDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
                duration={`${blog.readDuration || 5} mins read`}
                description={blog.shortDescription}
                href={`/blogs/${blog.slug}`}
              />
            ))
          )}
        </div>
        <div className="mt-9 lg:mt-auto flex justify-center items-center gap-2 flex-wrap">
          {/* Previous */}
          {/* <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button> */}

          {/* Page Numbers */}
          {/* {Array.from({ length: totalPages }).map((_, idx) => (
              <Button
                key={idx}
                variant={page === idx + 1 ? "default" : "outline"}
                onClick={() => setPage(idx + 1)}
                className="w-9 px-0 text-sm"
              >
                {idx + 1}
              </Button>
            ))} */}

          {/* Next */}
          {/* <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button> */}
        </div>
      </div>
    </>
  );
};

export default BlogsContentItems;
