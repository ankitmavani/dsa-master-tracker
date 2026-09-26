import { api } from "@/lib/axios";

export const roadmapApi = {
  getAll: async () => {
    const res = await api.get("/roadmaps");
    return res.data; // don't use .data.data yet
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/roadmaps/${id}`);
    return data;
  },

  create: async (payload: any) => {
    const res = await api.post("/roadmaps", payload);
    return res.data;
  },
};
