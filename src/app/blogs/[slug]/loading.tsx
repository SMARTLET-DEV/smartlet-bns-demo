import BlogDetailsSkeleton from '@/components/skeleton/BlogDetailsSkeleton';
import RelatedPostsSkeleton from '@/components/skeleton/RelatedPostsSkeleton';

export default function Loading() {
    return (
        <div className="w-full container mx-auto space-y-5">
            <BlogDetailsSkeleton />
            <RelatedPostsSkeleton />
        </div>
    );
}
