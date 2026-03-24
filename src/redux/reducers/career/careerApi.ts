import { baseApi } from "@/redux/api/baseAPi";

// TypeScript types matching API response structure
export interface JobPost {
    id: string;
    slug: string;
    title: string;
    team: string;
    jobCategory: string;
    location: string;
    workMode: string;
    employmentType: string;
    officeHours: string;
    overview: string;
    responsibilities: string[];
    qualifications: string[];
    benefits: string[];
    salaryText: string;
    contactEmail: string;
    applyInstruction: string;
    postedMonth: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface JobPostsResponse {
    data: {
        data: {
            meta: {
                total: number;
                take: number;
                skip: number;
            };
            items: JobPost[];
        };
    };
}

const JOB_TAG = "Job" as const;

export const careerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getActiveJobs: builder.query<JobPost[], void>({
            query: () => "/jobPosts?isActive=true",
            providesTags: [JOB_TAG],
            transformResponse: (response: JobPostsResponse) => {
                // Extract items array from nested response structure
                return response?.data?.data?.items || [];
            },
        }),
        applyJob: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: "/jobApplications/apply",
                method: "POST",
                body: formData,
            }),
        }),
    }),
});

export const { useGetActiveJobsQuery, useApplyJobMutation } = careerApi;
