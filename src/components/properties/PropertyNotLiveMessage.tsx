import Link from "next/link";

export default function PropertyNotLiveMessage() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-white/30 pointer-events-auto">
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#191919] text-center leading-relaxed max-w-2xl mx-4 px-4">
          This property is not live yet,
          <br />
          please check back after a few hours.
        </h2>
        <Link
          href="/"
          className="text-[#e8566f] font-normal text-lg hover:underline transition-all"
        >
          Go back to home
        </Link>
      </div>
    </div>
  );
}
