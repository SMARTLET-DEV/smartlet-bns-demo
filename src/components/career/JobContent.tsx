import { JobPost } from "@/redux/reducers/career/careerApi";

interface JobContentProps {
  job: JobPost;
}

export function JobContent({ job }: JobContentProps) {
    return (
        <div className="lg:col-span-2">
            {/* Overview */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-4">
          Overview
                </h2>
                <p className="text-gray-700 leading-relaxed font-light">
                    {job.overview}
                </p>
            </section>

            {/* Responsibilities */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-4">
          Responsibilities
                </h2>
                <ul className="space-y-3">
                    {job.responsibilities.map((item, index) => (
                        <li
                            key={index}
                            className="text-gray-700 font-light flex items-start"
                        >
                            <span className="mr-2">-</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Qualifications */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-4">
          Qualifications
                </h2>
                <ul className="space-y-3">
                    {job.qualifications.map((item, index) => (
                        <li
                            key={index}
                            className="text-gray-700 font-light flex items-start"
                        >
                            <span className="mr-2">-</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-4">
            Benefits
                    </h2>
                    <ul className="space-y-3">
                        {job.benefits.map((item, index) => (
                            <li
                                key={index}
                                className="text-gray-700 font-light flex items-start"
                            >
                                <span className="mr-2">-</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
