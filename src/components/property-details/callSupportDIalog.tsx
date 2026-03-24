import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "../ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCallSupportDialog } from "@/redux/reducers/property/propertySlice";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PhoneIcon } from "@/assets/icons";

export default function CallSupportDialog() {
    const dispatch = useDispatch();
    const open = useSelector(
        (state: RootState) => state.property.propertyModal.callSupportDialog
    );
    const isMobile = useIsMobile();

    const handleClose = () => {
        dispatch(setCallSupportDialog(false));
    };

    const handleCallClick = () => {
        window.location.href = "tel:+8801711994478";
        dispatch(setCallSupportDialog(false));
    };

    const content = (
        <div className="py-4">
            <div className="flex items-center justify-between">
                <p className="text-[1.25rem] sm:text-[1.5rem] font-normal text-secondary tracking-tight">
          +880 1711 99 44 78
                </p>
                <Button
                    onClick={handleCallClick}
                    className="flex items-center gap-2 bg-[#CBC3E3] hover:bg-[#d14560] text-white px-5 py-3 rounded-md shadow-none hover:shadow-none focus:shadow-none active:shadow-none outline-none"
                >
                    <PhoneIcon fill="white" className="w-5 h-5" />
          Call Now
                </Button>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <Drawer
                open={open}
                onOpenChange={(value) => dispatch(setCallSupportDialog(value))}
            >
                <DrawerContent className="px-4 pb-6">
                    <DrawerTitle className="sr-only">Call Support</DrawerTitle>
                    {content}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => dispatch(setCallSupportDialog(value))}
        >
            <DialogContent className="sm:max-w-[400px]">
                <DialogTitle className="sr-only">Call Support</DialogTitle>
                {content}
            </DialogContent>
        </Dialog>
    );
}
