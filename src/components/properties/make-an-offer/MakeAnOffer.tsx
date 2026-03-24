"use client";

import { Building } from "@/assets/icons";
import { setMakeAnOffer } from "@/redux/reducers/property/propertySlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/ResponsiveDialog";
import OfferForm from "./OfferForm";

export default function MakeAnOffer() {
    const makeAnOffer = useSelector(
        (state: RootState) => state.property.propertyModal.makeAnOffer
    );
    const dispatch = useDispatch();

    return (
        <Dialog
            open={makeAnOffer}
            onOpenChange={(state) => dispatch(setMakeAnOffer(state))}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] sm:max-w-[685px] bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-normal pb-3 border-b border-card">
                        <Building className="w-6 h-6" />
                        Make an Offer
                    </DialogTitle>
                </DialogHeader>
                <OfferForm />
            </DialogContent>
        </Dialog>
    );
}
