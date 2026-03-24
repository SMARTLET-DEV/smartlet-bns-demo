"use client";
import { BlogCard } from "@/components/blogcard/BlogCard";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetAllBlogsQuery } from "@/redux/reducers/blog/blogsApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BlogCardSkeleton } from "../skeleton/BlogCardSkeleton";

const NewsArticleContainer = () => {
    const {
        data: blogData,
        isLoading: isBlogLoading,
        isError: isBlogError,
        error: blogError,
    } = useGetAllBlogsQuery({ skip: 0, take: 10 });
    const router = useRouter();

    if (isBlogError && blogError) {
        console.error("Error fetching blogs:", blogError);
    }

    return (
        <section className="py-10 bg-white relative">
            <div className="container mx-auto px-5">
                {/* <h2 className="text-3xl font-normal mb-10 text-left">News & Article</h2> */}

                <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselPrevious className="rounded-sm hover:border-primary hover:text-primary -left-3 z-10 bg-white" />
                    <CarouselContent className="flex gap-7 p-2 ml-1 mr-1">
                        {isBlogLoading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="shrink-0 w-[350px] sm:w-[390px]">
                                    <BlogCardSkeleton />
                                </div>
                            ))
                        ) : isBlogError ? (
                            <div className="text-muted text-center">
                                Failed to load blog posts.
                            </div>
                        ) : (
                            blogData?.blogs?.map((blog: any) => (
                                <div
                                    key={blog.id}
                                    className="shrink-0 w-[350px] sm:w-[390px]"
                                >
                                    <BlogCard
                                        key={blog.id}
                                        src={
                                            blog.thumbnail ||
                                            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                                        }
                                        title={blog.title}
                                        description={blog.shortDescription}
                                        date={new Date(
                                            blog.createdAt
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                        duration={`${blog.readDuration || 5
                                        } mins read`}
                                        href={`/blogs/${blog.slug || blog.id}`}
                                    />
                                </div>
                            ))
                        )}
                    </CarouselContent>
                    <CarouselNext className="rounded-sm hover:border-primary hover:text-primary -right-3 md:-right-5 z-10 bg-white" />
                </Carousel>

                <div className="mt-10 flex justify-center">
                    <Button
                        variant="default"
                        className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-white transition duration-300 sm:px-10 sm:py-6 text-base"
                        size="lg"
                        asChild
                    >
                        <Link href="/blogs">View All</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default NewsArticleContainer;
