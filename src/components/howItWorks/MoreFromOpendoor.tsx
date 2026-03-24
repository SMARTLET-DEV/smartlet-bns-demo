import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import { Vehicle, PropertyInspectionIcon } from '@/assets/icons'; // custom icons

const services = [
    {
        title: 'smartMOVE',
        description:
      'To simplify and humanize the property rental and relocation journey in Bangladesh by creating systems and services that offer real value, unmatched convenience, and fairness to all parties involved.',
        icon: <Vehicle className="w-8 h-8" />,
        href: '#',
    },
    {
        title: 'Home Inspection',
        description:
      'To be the platform that redefines urban living in Bangladesh — where every move, rental, and repair feels seamless, secure, and dignified.',
        icon: <PropertyInspectionIcon className="w-8 h-8" />,
        href: '#',
    },
];

const disabled = true;

export default function MoreFromOpendoor() {
    return (
        <section className="w-full py-12 bg-white">
            <div className="container mx-auto px-5 lg:px-20">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-center mb-10">
          More From OPENDOOR
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, index) => (
                        <Card
                            key={index}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 w-full"
                        >
                            <CardContent className="px-8 py-5 flex flex-col gap-6">
                                {/* Icon + Book Now */}
                                <div className="flex justify-between items-center">
                                    <div className="p-2 border border-[#E9E9E9] rounded-sm">
                                        {service.icon}
                                    </div>
                                    <a
                                        href={disabled ? undefined : service.href}
                                        className={`
                      font-medium flex items-center gap-1
                      ${disabled
                            ? "text-gray-400 pointer-events-none no-underline cursor-not-allowed"
                            : "text-[#EB5C60] hover:underline"
                        }
                    `}
                                        aria-disabled={disabled ? "true" : undefined}
                                        tabIndex={disabled ? -1 : undefined}
                                        onClick={disabled ? (e) => e.preventDefault() : undefined}
                                    >
                    Book Now <ArrowUpRight size={16} />
                                    </a>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-light text-[#191919]">
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p className="text-base text-[#767676] leading-relaxed">
                                    {service.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
