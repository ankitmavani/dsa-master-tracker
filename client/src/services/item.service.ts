import { api } from "@/lib/axios";

export const itemApi = {
  getByDay: async (dayId: string) => {
    const { data } = await api.get(`/items/day/${dayId}`);
    return data;
  },

  create: async (payload: any) => {
    const { data } = await api.post("/items", payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await api.put(`/items/${id}`, payload);
    return data;
  },

  updateFlags: async (id: string, flags: any) => {
    const { data } = await api.patch(`/items/${id}/flags`, flags);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/items/${id}`);
    return data;
  },
};
