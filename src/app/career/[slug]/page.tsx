"use client";

import { useGetActiveJobsQuery } from "@/redux/reducers/career/careerApi";
import { JobHeader } from "@/components/career/JobHeader";
import { JobContent } from "@/components/career/JobContent";
import { JobApplicationCard } from "@/components/career/JobApplicationCard";
import { notFound, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function JobDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Fetch all active jobs
    const { data: jobs, isLoading, isError } = useGetActiveJobsQuery();

    // Find the job matching the slug
    const job = jobs?.find((j) => j.slug === slug);

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Unable to load job details. Please try again later.</p>
                </div>
            </div>
        );
    }

    if (!job) {
        notFound();
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-5 py-12 sm:py-16">
                <JobHeader job={job} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <JobContent job={job} />
                    <JobApplicationCard job={job} />
                </div>
            </div>
        </div>
    );
}
