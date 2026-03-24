"use client"

import React from 'react';
import Image from 'next/image';

const RenterBenefits = () => {
  const benefits = [
    {
      title: "Negotiating",
      description: "OPENDOOR does the hard task for you and negotiates with homeowners on your behalf, be it any terms and conditions of the rental agreement.",
      image: "/how-it-works/renters_benefit/Negotiation.png"
    },
    {
      title: "Fair Pricing",
      description: "We ensure the rent you pay is backed by real market data from OPENDOOR's monthly field research, so you get the best deal.",
      image: "/how-it-works/renters_benefit/Fair Pricing.png"
    },
    {
      title: "Guided Viewing",
      description: "Your time is valuable so every property you visit is guided by an expert to ensure you know all the pros and cons that will help you make your decision.",
      image: "/how-it-works/renters_benefit/Guided Viewing Exp.png"
    },
    {
      title: "No More Convincing",
      description: "No more convincing homeowners or awkward conversations, your rental process is done with a couple of documents and fair selection criteria.",
      image: "/how-it-works/renters_benefit/No More Convincing.png"
    },
    {
      title: "Rental Dispute Protection",
      description: "When rented with OPENDOOR, you are covered with OPENDOORs' Tenancy Protection Policy in case of any unwanted situations.",
      image: "/how-it-works/renters_benefit/Rental Dispute Protection.png"
    },
    {
      title: "On-hand Assistance",
      description: "From search to moving in, our team is available to assist you in every step of the way to make it a smooth and stress-free experience.",
      image: "/how-it-works/renters_benefit/On Hand Assisstance.png"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-4">
            How OPENDOOR Makes It Easy
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white p-0 flex items-start"
            >
              <div className="flex-shrink-0">
                <Image
                  src={benefit.image}
                  alt={benefit.title}
                  width={110}
                  height={110}
                  className="object-cover object-center"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-light text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-base">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RenterBenefits;