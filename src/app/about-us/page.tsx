"use client"

import AppWrapper from "../appWrapper";
import PrinciplesGrid from "@/components/aboutUs/PrinciplesGrid";
import MissionFrame from "@/components/aboutUs/MissionFrame";
import PhilosophySection from "@/components/aboutUs/PhilosophySection";
import WhoWeAreSection from "@/components/aboutUs/WhoAreWeSection";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";
import ExploreServices from "@/components/why-choose-opendoor/ExploreServices";

function AboutPage() {
    return (
        <>
            <WhoWeAreSection/>
            <MissionFrame/>
            <PrinciplesGrid/>
            <PhilosophySection/>
            <ExploreServices/>
            <LoginModal/>
            <SignupModal/>

        </>
    );
}

export default AboutPage;
