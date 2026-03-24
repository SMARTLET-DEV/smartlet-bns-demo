"use client";

import { Building } from "@/assets/icons";
import { setApplyForRent } from "@/redux/reducers/property/propertySlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/ResponsiveDialog";
import Application from "./Application";

export default function ApplyForRent() {
    const applyForRent = useSelector(
        (state: RootState) => state.property.propertyModal.applyForRent
    );
    const dispatch = useDispatch();

    return (
        <Dialog
            open={applyForRent}
            onOpenChange={(state) => dispatch(setApplyForRent(state))}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] sm:max-w-[685px] bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-normal pb-3 border-b border-card">
                        <Building className="w-6 h-6" />
                        Apply for Rent
                    </DialogTitle>
                </DialogHeader>
                <Application />
            </DialogContent>
        </Dialog>
    );
}
