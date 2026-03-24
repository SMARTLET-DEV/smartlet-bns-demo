import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const RelatedPostsSkeleton = () => {
    return (
        <section className="w-full my-10">
            <div className="container mx-auto px-5">
                <h2 className="text-2xl font-normal mb-6">
                    <Skeleton width={200} height={30} />
                </h2>

                {/* Skeleton for Carousel */}
                <div className="flex gap-7 p-2 ml-1 mr-1">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="shrink-0 w-[350px] sm:w-[390px]">
                            <div className="bg-gray-200 p-4">
                                <Skeleton height={200} width={`100%`} />
                                <Skeleton count={2} height={15} style={{ marginTop: 10 }} />
                                <Skeleton height={15} width={`80%`} style={{ marginTop: 10 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedPostsSkeleton;
