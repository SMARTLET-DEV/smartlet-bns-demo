"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import * as React from "react";

// Import Dialog components
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

// Import Drawer components
import { Drawer as DrawerPrimitive } from "vaul";

// Dialog Components
function Dialog({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className={cn(
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
                className
            )}
            {...props}
        />
    );
}

function DialogContent({
    className,
    children,
    hideCloseButton = false,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    hideCloseButton?: boolean;
}) {
    return (
        <DialogPortal data-slot="dialog-portal">
            <DialogOverlay />
            <DialogPrimitive.Content
                data-slot="dialog-content"
                className={cn(
                    "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
                    className
                )}
                {...props}
            >
                {children}
                {!hideCloseButton && (
                    <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                        <XIcon />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn(
                "flex flex-col gap-2 text-center sm:text-left",
                className
            )}
            {...props}
        />
    );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className
            )}
            {...props}
        />
    );
}

function DialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn("text-lg leading-none font-normal", className)}
            {...props}
        />
    );
}

function DialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

// Drawer Components
const Drawer = ({
    shouldScaleBackground = true,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
    <DrawerPrimitive.Root
        shouldScaleBackground={shouldScaleBackground}
        {...props}
    />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay
        ref={ref}
        className={cn("fixed inset-0 z-50 bg-black/80", className)}
        {...props}
    />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
        hideCloseButton?: boolean;
    }
>(({ className, children, hideCloseButton = false, ...props }, ref) => (
    <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
            ref={ref}
            className={cn(
                "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
                className,
                "rounded-b-none overflow-y-hidden"
            )}
            {...props}
        >
            {/* <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" /> */}
            <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>
            {!hideCloseButton && (
                <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DrawerClose>
            )}
        </DrawerPrimitive.Content>
    </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("grid gap-1.5 pb-4 text-center sm:text-left", className)}
        {...props}
    />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("mt-auto flex flex-col gap-2", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Title
        ref={ref}
        className={cn(
            "text-lg font-normal leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

// Responsive Components
interface ResponsiveDialogProps
    extends React.ComponentProps<typeof DialogPrimitive.Root> {
    breakpoint?: number;
}

const ResponsiveDialog = ({
    breakpoint = 640,
    ...props
}: ResponsiveDialogProps) => {
    const isMobile = useIsMobile(breakpoint);
    return isMobile ? <Drawer {...props} /> : <Dialog {...props} />;
};

const ResponsiveDialogTrigger = ({
    breakpoint = 640,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger> & {
    breakpoint?: number;
}) => {
    const isMobile = useIsMobile(breakpoint);
    return isMobile ? (
        <DrawerTrigger {...props} />
    ) : (
        <DialogTrigger {...props} />
    );
};

const ResponsiveDialogClose = ({
    breakpoint = 640,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close> & {
    breakpoint?: number;
}) => {
    const isMobile = useIsMobile(breakpoint);
    return isMobile ? <DrawerClose {...props} /> : <DialogClose {...props} />;
};

const ResponsiveDialogOverlay = ({
    breakpoint = 640,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay> & {
    breakpoint?: number;
}) => {
    const isMobile = useIsMobile(breakpoint);
    return isMobile ? (
        <DrawerOverlay {...props} />
    ) : (
        <DialogOverlay {...props} />
    );
};

interface ResponsiveDialogContentProps
    extends React.ComponentProps<typeof DialogPrimitive.Content> {
    hideCloseButton?: boolean;
    breakpoint?: number;
}

const ResponsiveDialogContent = ({
    breakpoint = 640,
    ...props
}: ResponsiveDialogContentProps) => {
    const isMobile = useIsMobile(breakpoint);
    return isMobile ? (
        <DrawerContent {...props} />
    ) : (
        <DialogContent {...props} />
    );
};

const ResponsiveDialogHeader = ({
    breakpoint = 640,
    ...props
}: React.ComponentProps<"div"> & { breakpoint?: number }) => {
    const isMobile = useIsMobile(breakpoint);
    return isMobile ? <DrawerHeader {...props} /> : <DialogHeader {...props} />;
};

const ResponsiveDialogFooter = ({
    breakpoint = 640,
    ...props
}: React.ComponentProps<"div"> & { breakpoint?: number }) => {
    const isMobile = useIsMobile(breakpoint);
    return isMobile ? <DrawerFooter {...props} /> : <DialogFooter {...props} />;
};

const ResponsiveDialogTitle = ({
    breakpoint = 640,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & {
    breakpoint?: number;
}) => {
    const isMobile = useIsMobile(breakpoint);
    return isMobile ? <DrawerTitle {...props} /> : <DialogTitle {...props} />;
};

const ResponsiveDialogDescription = ({
    breakpoint = 640,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description> & {
    breakpoint?: number;
}) => {
    const isMobile = useIsMobile(breakpoint);
    return isMobile ? (
        <DrawerDescription {...props} />
    ) : (
        <DialogDescription {...props} />
    );
};

// Export the responsive components as the main exports
export {
    ResponsiveDialog as Dialog,
    ResponsiveDialogClose as DialogClose,
    ResponsiveDialogContent as DialogContent,
    ResponsiveDialogDescription as DialogDescription,
    ResponsiveDialogFooter as DialogFooter,
    ResponsiveDialogHeader as DialogHeader,
    ResponsiveDialogOverlay as DialogOverlay,
    ResponsiveDialogTitle as DialogTitle,
    ResponsiveDialogTrigger as DialogTrigger,
};
