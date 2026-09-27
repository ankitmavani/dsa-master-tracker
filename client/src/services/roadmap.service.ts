import { api } from "@/lib/axios";

export const roadmapApi = {
  getAll: () => api.get("/roadmaps"),
  getById: async (id: string) => {
    const { data } = await api.get(`/roadmaps/${id}`);
    return data;
  },

  create: (payload: any) => api.post("/roadmaps", payload),

  bulkUpload: (formData: FormData) =>
    api.post("/roadmaps/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
