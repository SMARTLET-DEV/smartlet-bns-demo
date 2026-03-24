import { baseApi } from "@/redux/api/baseAPi";
import { User } from "../auth/authSlice";

type Blog = {
  id: string;
  title: string;
  metaTitle?: string | null;
  slug?: string;
  shortDescription?: string | null;
  description?: string;
  media?: string | null;
  readDuration?: string | null;
  thumbnail?: string | null;
  publishingDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  publisher?: string | null;
  userId?: string | null;
  user?: User | null;
};

type Pagination = {
  totalCount: number;
  take: number;
  skip: number;
  currentPage: number;
  totalPages: number;
  nextCursor: string | null;
  hasMore: boolean;
};

type BlogsResponse = {
  blogs: Blog[];
  pagination: Pagination;
};

type SingleBlogResponse = {
  blog: Blog;
};

export const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBlogs: builder.query<BlogsResponse, { skip?: number; take?: number }>(
            {
                // Fixed return type
                query: ({ skip = 0, take = 10 }) =>
                    `/blogs?skip=${skip}&take=${take}&orderBy=-createdAt`,
                providesTags: (result) =>
                    result?.blogs
                        ? [
                            { type: "Blog" as const, id: "LIST" },
                            ...result.blogs.map((blog) => ({
                                type: "Blog" as const,
                                id: blog.id,
                            })),
                        ]
                        : [{ type: "Blog" as const, id: "LIST" }],
                transformResponse: (response: BlogsResponse) => response,
            }
        ),
        getSingleBlog: builder.query<SingleBlogResponse, string>({
            query: (id) => `/blogs/${id}`,
            providesTags: (result, error, id) => [{ type: "Blog" as const, id }],
            transformResponse: (response: SingleBlogResponse) => response,
        }),
    }),
});

export const { useGetAllBlogsQuery, useGetSingleBlogQuery } = blogApi;
