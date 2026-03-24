import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type CustomModalProps = {
  triggerNode?: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  triggerState?: boolean;
  className?: any;
  setTriggerState?: (val: boolean) => void;
};

export function CustomModal({
    triggerNode,
    title,
    description,
    children,
    footer,
    triggerState,
    className,
    setTriggerState,
}: CustomModalProps) {
    return (
        <Dialog open={triggerState} onOpenChange={setTriggerState} modal={true}>
            {triggerNode && <DialogTrigger asChild>{triggerNode}</DialogTrigger>}
            <DialogContent
                className={`w-full max-w-[95vw] md:max-w-[80vw] lg:max-w-[1200px] h-[90vh] max-h-[680px] ${className}`}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    );
}
