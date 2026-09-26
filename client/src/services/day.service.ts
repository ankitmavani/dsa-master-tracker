import { api } from "@/lib/axios";

export const dayApi = {
  create: async (payload: { roadmapId: string; title: string }) => {
    const { data } = await api.post("/days", payload);
    return data;
  },
};
