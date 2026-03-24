"use client";

interface TermsSectionProps {
  title: string;
  points?: string[];
  intro?: string;
  outro?: string;
}

export default function TermsSection({ title, points,intro,outro }: TermsSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-normal mb-3">{title}</h2>
      {intro && <p className="list-disc list-inside space-y-2 text-base text-gray-600 font-light text-justify mb-5">{intro}</p>}
      <ul className="list-disc list-inside space-y-2 text-base text-gray-600 font-light text-justify">
        {points?.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      {outro && <p className="list-disc list-inside space-y-2 text-base text-gray-600 font-light text-justify mt-5">{outro}</p>}
    </section>
  );
}
