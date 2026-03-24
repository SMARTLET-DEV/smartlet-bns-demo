'use client';

import { FaqHero } from "@/components/faqs/FaqHero";
import AppWrapper from "../appWrapper";
import FaqContainer from "@/components/faqs/FaqContainer";
import { ContactForm } from "@/components/contactUs/ContactForm";
import ExploreServices from "@/components/why-choose-opendoor/ExploreServices";

function FaqPage() {
  
  return (
    <>
      <FaqHero />
      <FaqContainer />
      <ContactForm title="Still Have Questions?"/>
      <ExploreServices/>
    </>
  );
}

export default FaqPage;
