const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchProperty(id: string) {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const res = await fetch(`${BASE_URL}/properties/${id}`, {
    next: { tags: [`property-${id}`] }, // For revalidation
  });

  if (!res.ok) throw new Error("Failed to fetch property");
  return res.json();
}
