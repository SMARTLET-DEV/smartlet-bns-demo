import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 

const BlogDetailsSkeleton = () => {
  return (
    <section className="w-full py-8 mt-8">
      <div className="container mx-auto px-5">
        {/* --- Top Section: Title & Meta --- */}
        <div className="mt-8 md:px-20 lg:px-35 text-center mb-4">
          {/* Title Skeleton - Three lines of large text */}
          <div className="space-y-4 w-full max-w-3xl mx-auto">
            <Skeleton height={20} width="100%" borderRadius={4} />
            <Skeleton height={20} width="100%" borderRadius={4} />
            <Skeleton height={20} width="100%" borderRadius={4} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-gray-500 text-base font-medium mt-4">
            {/* Publisher Skeleton */}
            <div style={{ minWidth: '60px' }}>
              <Skeleton height={20} width="100%" borderRadius={4} />
            </div>
            <span className="mx-1">•</span>

            {/* Date Skeleton */}
            <div style={{ minWidth: '75px' }}>
              <Skeleton height={20} width="100%" borderRadius={4} />
            </div>
            <span className="mx-1">•</span>

            {/* Read Duration Skeleton */}
            <div style={{ minWidth: '60px' }}>
              <Skeleton height={20} width="100%" borderRadius={4} />
            </div>
          </div>
        </div>

        {/* --- Description --- */}
        <div className="mt-8 md:px-20 lg:px-35">
          <Skeleton count={5} height={20} />
          <Skeleton count={3} height={15} />
          <Skeleton count={3} height={15} />
          <Skeleton count={3} height={15} />
          <Skeleton count={3} height={15} />
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsSkeleton;
