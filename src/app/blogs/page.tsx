import AppWrapper from "../appWrapper";
import BlogsContentItems from "@/components/blogs/blogsContentItems";

export default function BlogsPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-10">
        <section>
          <h2 className="text-xl sm:text-2xl font-light mb-6 mt-4">All Blogs</h2>
          <BlogsContentItems />
        </section>
      </div>
    </> 
  );
}
