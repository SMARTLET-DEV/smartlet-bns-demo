"use client";
import React from "react";
import { BlogCard } from "../blogcard/BlogCard";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

type RelatedPost = {
  id: string;
  image: string;
  title: string;
  date: string; 
  duration: string; 
  slug: string;
  description: string;
};

type RelatedPostsSectionProps = {
  posts: RelatedPost[];
};

export default function RelatedPostsSection({ posts }: RelatedPostsSectionProps) {
    const router = useRouter();

    return (
        <section className="w-full my-10">
            <div className="container mx-auto px-5">
                <h2 className="text-xl sm:text-2xl font-light mb-6">Related Blogs</h2>

                {/* Carousel for Related Posts */}
                <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselPrevious className="rounded-sm hover:border-primary hover:text-primary -left-3 z-10 bg-white" />
                    <CarouselContent className="flex gap-7 p-2 ml-1 mr-1">
                        {posts.length === 0 ? (
                            <div className="text-muted text-center">No related blogs available.</div>
                        ) : (
                            posts.map((post) => (
                                <div key={post.id} className="shrink-0 w-[350px] sm:w-[390px]">
                                    <BlogCard
                                        src={
                                            post.image ||
                      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                                        }
                                        title={post.title}
                                        description={post.description}
                                        date={post.date}
                                        duration={post.duration}
                                        href={`/blogs/${post.slug}`}
                                    />
                                </div>
                            ))
                        )}
                    </CarouselContent>
                    <CarouselNext className="rounded-sm hover:border-primary hover:text-primary -right-5 z-10 bg-white" />
                </Carousel>
            </div>
        </section>
    );
}
