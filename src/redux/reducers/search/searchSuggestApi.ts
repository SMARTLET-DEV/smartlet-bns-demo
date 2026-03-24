// redux/reducers/searchSuggestApi.ts
import { baseApi } from "@/redux/api/baseAPi";

interface SearchSuggestResponse {
  success: boolean;
  suggestions: string[];
}

export const searchSuggestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSearchSuggestions: builder.query<string[], string>({
      query: (q) => `properties/search-suggestions?q=${q}`,
      transformResponse: (response: SearchSuggestResponse) => response.suggestions,
    }),
  }),
  overrideExisting: false,
});

export const { useLazyGetSearchSuggestionsQuery } = searchSuggestApi;
