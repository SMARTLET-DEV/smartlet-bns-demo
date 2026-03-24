"use client";

import { AddPropertyForm } from "@/components/smartview/AddAProperty";
import IntroducingSmartView from "@/components/smartview/IntroducingSmartView";
import SmartViewFeature from "@/components/smartview/SmartViewFeature";
import ExploreServices from "@/components/why-choose-opendoor/ExploreServices";

function SmartViewPage() {
    return (
        <>
            <IntroducingSmartView />
            <SmartViewFeature />
            <AddPropertyForm title="Create smartVIEW for Your Space" />
            <ExploreServices />
        </>
    );
}

export default SmartViewPage;
