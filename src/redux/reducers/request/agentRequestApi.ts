// src/redux/reducers/request/agentRequestApi.ts
import { baseApi } from "@/redux/api/baseAPi";

interface AgentRequestPayload {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    requestMessage?: string;
    userId?: string;
}

export const agentRequestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        submitAgentRequest: builder.mutation<void, AgentRequestPayload>({
            query: (body) => ({
                url: "/agent-assistance-requests",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useSubmitAgentRequestMutation } = agentRequestApi;
