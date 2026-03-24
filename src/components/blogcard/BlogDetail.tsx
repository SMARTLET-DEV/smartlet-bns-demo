import Image from "next/image";
import React from "react";
import Link from "next/link";

interface BlogDetailProps {
  src: string;
  title: string;
  date: string;
  duration: string;
  content: string;
  href?: string;
}

const BlogDetail: React.FC<BlogDetailProps> = ({
    src,
    title,
    date,
    duration,
    content,
    href = "#",
}) => {
    return (
        <div className="w-full px-6 py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-neutral-900 mb-6 text-left">
                <Link
                    href={href}
                    className="hover:underline focus:underline outline-none"
                    tabIndex={0}
                >
                    {title}
                </Link>
            </h1>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 md:w-[520px] md:flex-none w-full">
                    <Link
                        href={href}
                        tabIndex={-1}
                        className="block w-full"
                        style={{ outline: "none", boxShadow: "none" }}
                    >
                        <Image
                            src={src}
                            alt={title}
                            width={520}
                            height={280}
                            className="w-full h-[220px] md:h-[280px] object-cover rounded-3xl"
                        />
                    </Link>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-gray-400 font-normal flex items-center gap-2 mb-4 text-left">
                        <span>{date}</span>
                        <span className="mx-1">—</span>
                        <span>{duration}</span>
                    </div>
                    <div
                        className="text-base text-gray-500 font-light mb-4 space-y-4 text-left"
                        style={{ whiteSpace: "pre-line" }}
                    >
                        {content}
                    </div>
                    <Link
                        href={href}
                        className="text-red-400 text-sm font-normal underline underline-offset-2 hover:text-red-500 transition text-left block"
                    >
            Read More
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
