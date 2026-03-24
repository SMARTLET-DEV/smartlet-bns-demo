import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PropertyState {
  properties: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
  minPrice: number;
  loading: boolean;
  error: string | null;
  lastFetch: number;
}

const initialState: PropertyState = {
    properties: [],
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
    },
    minPrice: 0,
    loading: false,
    error: null,
    lastFetch: 0,
};

const propertyDataSlice = createSlice({
    name: "propertyData",
    initialState,
    reducers: {
        setProperties: (state, action: PayloadAction<any[]>) => {
            state.properties = action.payload;
            state.lastFetch = Date.now();
        },
        setPagination: (state, action: PayloadAction<any>) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        setMinPrice: (state, action: PayloadAction<number>) => {
            state.minPrice = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearProperties: (state) => {
            state.properties = [];
            state.pagination = initialState.pagination;
        },
    },
});

export const {
    setProperties,
    setPagination,
    setMinPrice,
    setLoading,
    setError,
    clearProperties,
} = propertyDataSlice.actions;

export default propertyDataSlice.reducer;
