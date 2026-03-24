import { Metadata } from "next";
import { parsePathToFilters } from "@/lib/urlService";
import { generatePropertyMetadata } from "@/lib/metadataService";

type Props = {
  params: Promise<{ params?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  // Build pathname with /residential prefix
  const pathname = resolvedParams.params
    ? `/residential/${resolvedParams.params.join("/")}`
    : "/residential/apartments-for-rent";

  const filters = parsePathToFilters(pathname);

  return generatePropertyMetadata(filters);
}

export default function ResidentialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
