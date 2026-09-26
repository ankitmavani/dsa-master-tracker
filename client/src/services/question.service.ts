import { api } from "@/lib/axios";

export const questionApi = {
  getByDay: async (dayId: string) => {
    const { data } = await api.get(`/questions/day/${dayId}`);
    return data;
  },

  create: async (payload: any) => {
    const { data } = await api.post("/questions", payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await api.put(`/questions/${id}`, payload);
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await api.patch(`/questions/${id}/status`, { status });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/questions/${id}`);
    return data;
  },
};
