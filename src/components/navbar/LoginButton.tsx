import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const LoginButton = ({
    className = "",
    ...props
}: React.ComponentProps<"button">) => (
    <Button
        id="login-button"
        variant="outline"
        size="sm"
        className={cn(
            "text-sm bg-transparent cursor-pointer hover:border-primary hover:bg-primary hover:text-white duration-200",
            className
        )}
        {...props}
    >
        Login
    </Button>
);
