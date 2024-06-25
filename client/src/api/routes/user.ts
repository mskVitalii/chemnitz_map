import { TCategory } from "@app/interfaces/places";
import { IUserData } from "@app/interfaces/user";
import { AxiosInstance } from "axios";

export const user = (
  ApiClient: (methodName?: string) => Promise<AxiosInstance>
) => {
  return {
    create: async (data: IUserData) =>
      (await ApiClient("Register user")).post(`/user`, data),

    getByID: async (id: string) =>
      (await ApiClient("Get user by id")).get(`/user/${id}`),

    put: async (id: string, data: IUserData) => (await ApiClient("Update user")).put(`/user/${id}`, data),

    delete: async (id: string) => (await ApiClient("Delete user")).delete(`/user/${id}`),
  };
};
