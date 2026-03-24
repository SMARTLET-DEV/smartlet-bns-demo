"use client";

import "quill/dist/quill.snow.css";

type blog = {
  createdAt: string;
  description: string;
  id: string;
  media: string;
  metaTitle: string | null;
  publisher: string | null;
  publishingDate: string;
  readDuration: number | null;
  shortDescription: string;
  slug: string;
  thumbnail: string | null;
  title: string;
  updatedAt: string;
  userId: string;
};

type blogDetailsPageContainerProps = {
  blog: blog;
};

const BlogDetailsPageContainer = ({ blog }: blogDetailsPageContainerProps) => {
    return (
        <section className="w-full py-8 mt-8">
            <div className="container mx-auto px-5">
                {/* --- Top Section: Title & Meta --- */}
                <div className="flex flex-col items-center text-center mb-4">
                    <h1 className="md:px-20 lg:px-35 font-light text-4xl sm:text-5xl lg:text-6xl leading-tight mb-2 break-words">
                        {blog.title}
                    </h1>
                    <div className="flex flex-col items-center">
                        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-gray-500 text-base font-medium">
                            <span>{blog.publisher || "OPENDOOR"}</span>
                            <span className="mx-1">•</span>
                            <span>
                                {new Date(
                                    blog.publishingDate || blog.createdAt
                                ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                            <>
                                <span className="mx-1">•</span>
                                <span>
                                    {blog.readDuration
                                        ? `${blog.readDuration} mins read`
                                        : "5 mins read"}
                                </span>
                            </>
                        </div>
                    </div>
                </div>

                {/* --- Description --- */}
                <div className="mt-8 md:px-20 lg:px-35">
                    <div
                        className="ql-editor"
                        dangerouslySetInnerHTML={{ __html: blog.description }}
                    ></div>
                </div>
            </div>
        </section>
    );
};

export default BlogDetailsPageContainer;
