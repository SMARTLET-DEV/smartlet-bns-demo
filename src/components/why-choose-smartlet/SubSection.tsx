import { Section } from "@/app/why-choose-opendoor/page";
import Image from "next/image";

const SubSection = ({ section }: { section: Section }) => {
    return (
        <section
            id={section.sectionId}
            className="lg:py-10 py-5 flex items-center flex-col lg:grid lg:grid-cols-2 text-secondary gap-x-24 gap-y-10"
        >
            <div
                className={`relative w-full aspect-[249/164] ${
                    section.id % 2 !== 0 ? "lg:order-last" : ""
                }`}
            >
                <Image
                    src={section.img}
                    alt={section.title}
                    fill
                    className="object-contain w-full h-full"
                />
            </div>
            <div className="flex flex-col">
                <p className="text-xl sm:text-2xl font-light">{section.title}</p>
                <p className="text-lg font-light text-muted mt-1">
                    {section.subTitle}
                </p>
                <p className="text-base text-muted mt-5">{section.description}</p>
                <div className="flex flex-col gap-6 mt-6">
                    {section.details.map((detail, index) => (
                        <div key={index} className="flex flex-col">
                            <p className="text-lg font-light">{detail.title}</p>
                            <p className="text-base text-muted">
                                {detail.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SubSection;
