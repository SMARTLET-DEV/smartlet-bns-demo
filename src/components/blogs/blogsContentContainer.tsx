"use client";
import BlogsContentItems from "./blogsContentItems";

const BlogsContainer = () => {
    return (
        <>
            {/* <ListingFilter /> */}
            <section className="blogContentContainer">
                <h2 className="text-xl sm:text-2xl font-light mb-6 mt-4">All Blogs</h2>
                <BlogsContentItems />
            </section>
        </>
    );
};

export default BlogsContainer;