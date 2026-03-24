import Link from "next/link";
import { JobPost } from "@/redux/reducers/career/careerApi";

interface JobHeaderProps {
  job: JobPost;
}

export function JobHeader({ job }: JobHeaderProps) {
    return (
        <>
            {/* Back Button */}
            <Link
                href="/career"
                className="inline-flex items-center text-gray-600 hover:text-primary mb-8 font-light"
            >
        ← Back to Careers
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-2">
                    {job.title}
                </h1>
                <p className="text-gray-600 font-light">{job.team}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-primary font-light">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.workMode}</span>
                    <span>•</span>
                    <span>{job.employmentType}</span>
                </div>
            </div>
        </>
    );
}
