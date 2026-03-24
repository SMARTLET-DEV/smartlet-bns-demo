import { cn } from "@/lib/utils";
import Link from "next/link";

export default function FooterLink({
    href,
    name,
    disabled,
    className,
}: {
    href: string;
    name: string;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <Link
            href={href}
            className={cn(
                `text-muted hover:underline duration-300 ${
                    disabled
                        ? "opacity-50 pointer-events-none"
                        : "pointer-events-auto"
                }`,
                className
            )}
        >
            {name}
        </Link>
    );
}
