const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchAllBlogs() {
    const res = await fetch(`${BASE_URL}/blogs?take=10&orderBy=-publishingDate`, {
        next: { tags: ["blogs-latest"] }, // For revalidation
    });
    if (!res.ok) throw new Error("Failed to fetch blogs");
    return res.json();
}
