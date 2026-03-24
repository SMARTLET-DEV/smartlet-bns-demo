import { useGetSinglePropertyQuery } from "@/redux/reducers/property/propertyApi";
import Link from "next/link";
import { useParams } from "next/navigation";

const PropertyBreadCrumb = () => {
  const { id } = useParams();
  const propertyId = id as string;
  //const property = dummyProperty;

  const { data, isLoading, isError } = useGetSinglePropertyQuery(propertyId);
  const property = data?.property;

  return (
    <>
      <div className="hidden md:block w-full container mx-auto py-4 px-9 xl:px-5 bg-white">
        <nav className="text-sm text-muted-foreground flex items-center gap-2">
          <Link
            href="/"
            className="hover:underline text-foreground font-medium"
          >
            Home
          </Link>
          <span className="text-muted">›</span>
          <span className="text-foreground">Property details</span>
        </nav>
      </div>
    </>
  );
};

export default PropertyBreadCrumb;
