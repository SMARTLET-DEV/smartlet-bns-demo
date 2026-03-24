"use client"

import MoreFromOpendoor from "@/components/howItWorks/MoreFromOpendoor";
import AppWrapper from "../appWrapper";
import WelcomeBanner from "@/components/howItWorks/WelcomeBanner";
import HowOpendoorWorks from "@/components/howItWorks/HowSmarletWorks";
import HowOpendoorJourney from "@/components/howItWorks/HowOpendoorJourney";
import MobileShowcase from "@/components/howItWorks/MobileShowCase";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";
import ExploreServices from "@/components/why-choose-opendoor/ExploreServices";
import StepsGridRenter from "@/components/howItWorks/StepsGridRenter";
import RenterBenefits from "@/components/howItWorks/RenterBenefits";

export default function HowItWorks(){
    return (
        <>
            <RenterBenefits/>
            <HowOpendoorWorks/>
            <StepsGridRenter/>
            <ExploreServices/>
            <LoginModal/>
            <SignupModal/>
        </>
    )
}