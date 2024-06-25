import { TCategory } from "@app/interfaces/places";
import { AxiosInstance } from "axios";

export const places = (
  ApiClient: (methodName?: string) => Promise<AxiosInstance>
) => {
  return {
    getList: async (categories: TCategory[]) =>
      (await ApiClient("Get POI list")).post(`/searchPlace`, {
        HasEmail: "false",
        categories,
        isBarrierFree: "false",
      }),

    getByID: async (id: string) =>
      (await ApiClient("Get POI by id")).get(`/place/${id}`),
  };
};
