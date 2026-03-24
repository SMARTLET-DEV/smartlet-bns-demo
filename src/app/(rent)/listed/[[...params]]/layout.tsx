import { Metadata } from "next";
import { parsePathToFilters } from "@/lib/urlService";
import { generatePropertyMetadata } from "@/lib/metadataService";

type Props = {
  params: Promise<{ params?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;

    // Build pathname with /listed prefix
    const pathname = resolvedParams.params
        ? `/listed/${resolvedParams.params.join("/")}`
        : "/listed";

    const filters = parsePathToFilters(pathname);

    return generatePropertyMetadata(filters);
}

export default function ListedLayout({
    children,
}: {
  children: React.ReactNode;
}) {
    return <>{children}</>;
}
