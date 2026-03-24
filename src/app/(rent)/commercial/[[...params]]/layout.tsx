import { Metadata } from "next";
import { parsePathToFilters } from "@/lib/urlService";
import { generatePropertyMetadata } from "@/lib/metadataService";

type Props = {
  params: Promise<{ params?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  // Build pathname with /commercial prefix
  const pathname = resolvedParams.params
    ? `/commercial/${resolvedParams.params.join("/")}`
    : "/commercial/space-for-rent";

  const filters = parsePathToFilters(pathname);

  return generatePropertyMetadata(filters);
}

export default function CommercialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
