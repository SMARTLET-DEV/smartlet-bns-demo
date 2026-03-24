const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchBlog(slug: string) {
  const res = await fetch(`${BASE_URL}/blogs/bySlug/${slug}`, {
    next: { tags: [`blog-${slug}`] }, // For revalidation
  });
  // console.log(res);
  if (!res.ok) throw new Error("Failed to fetch property");
  return res.json();
}
