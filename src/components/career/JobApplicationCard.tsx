"use client";

import { Mail, Clock, Briefcase, Calendar, MapPin, Timer, AlertCircle } from "lucide-react";
import { JobPost } from "@/redux/reducers/career/careerApi";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { JobApplicationModal } from "./JobApplicationModal";

interface JobApplicationCardProps {
  job: JobPost;
}

export function JobApplicationCard({ job }: JobApplicationCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 sticky top-8">
                {/* Apply Button - Top */}
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full mb-6"
                >
          Apply for this job
                </Button>

                <JobApplicationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    job={job}
                />

                {/* Salary */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-500 font-medium text-lg">৳</span>
                    </div>
                    <div>
                        <p className="font-normal text-gray-900">{job.salaryText}</p>
                        <p className="text-base text-gray-500 font-light">Salary</p>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="font-normal text-gray-900">{job.location}</p>
                        <p className="text-base text-gray-500 font-light">Location</p>
                    </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Timer className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="font-normal text-gray-900">{job.officeHours}</p>
                        <p className="text-base text-gray-500 font-light">Office Hours</p>
                    </div>
                </div>

                {/* Job Type */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="font-normal text-gray-900">{job.employmentType}</p>
                        <p className="text-base text-gray-500 font-light">Job type</p>
                    </div>
                </div>

                {/* Department */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="font-normal text-gray-900">{job.team}</p>
                        <p className="text-base text-gray-500 font-light">Job Category</p>
                    </div>
                </div>

                {/* Posted Date */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="font-normal text-gray-900">{job.postedMonth}</p>
                        <p className="text-base text-gray-500 font-light">Posted</p>
                    </div>
                </div>


                {/* Contact Email - Second last */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="font-normal text-gray-900">{job.contactEmail}</p>
                        <p className="text-base text-gray-500 font-light">Contact Email</p>
                    </div>
                </div>

                {/* CV instruction - Last */}
                {job.applyInstruction && (
                    <p className="text-primary text-base font-light">
                        {job.applyInstruction}
                    </p>
                )}
            </div>

            {/* Company Info */}
            {/* <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mt-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-normal text-sm">S</span>
          </div>
          <div>
            <p className="font-normal text-gray-900">OPENDOOR Bangladesh</p>
            <p className="text-sm text-primary font-light">Dhaka, Bangladesh</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 font-light">
          We are committed to creating an inclusive and innovative workplace
          where every team member can thrive.
        </p>
      </div> */}
        </div>
    );
}
