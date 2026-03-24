import { baseApi } from "@/redux/api/baseAPi";

export interface SelectPackageResponse {
  success: boolean;
  message: string;
  proceed: boolean;
  isPaid?: boolean;
  enlistingEnabled?: boolean;
  paymentLink?: string;
  serviceRequestId?: string;
  invoice?: {
    title: string;
    description: string;
    amount: number;
    currency: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    date: string;
    items: {
      name: string;
      qty: number;
      unitPrice: number;
      total: number;
    }[];
  };
}

export const selectPackageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        selectPackage: builder.mutation<
      SelectPackageResponse,
      { package: string; propertyType: string }
    >({
        query: (body) => ({
            url: "/properties/select-package",
            method: "POST",
            body,
        }),
    }),
    }),
});

export const { useSelectPackageMutation } = selectPackageApi;
