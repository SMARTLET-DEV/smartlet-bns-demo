import React from "react";
import { Play } from "lucide-react";

export default function VideoPlaceholder() {
    return (
        <div className="relative w-full max-w-5xl mx-auto h-110 bg-white rounded-xl flex items-center justify-center mb-8">
            {/* Play button */}
            <div className="bg-[#D9D9D94D] rounded-full p-6 flex items-center justify-center">
                <Play fill="#D9D9D9" strokeWidth={0} className="w-10 h-10 text-[#D9D9D9]" />
            </div>
        </div>
    );
}
