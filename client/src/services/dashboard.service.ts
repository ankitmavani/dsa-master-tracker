import { api } from "@/lib/axios";

export const dashboardApi = {
  get: async () => {
    const { data } = await api.get("/dashboard");
    return data;
  },
};
