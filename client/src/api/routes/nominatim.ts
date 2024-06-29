import { AxiosInstance } from "axios";

export const nominatim = (
  ApiClient: (methodName?: string) => Promise<AxiosInstance>
) => {
  return {
    getInfoByCoords: async (jsonData: any) =>
      (await ApiClient("Get point additional information")).get(
        `https://nominatim.openstreetmap.org/reverse?lat=${jsonData.coords.y}&lon=${jsonData.coords.x}&format=json&extratags=1&accept-language=en`
      ),
    getCoords: async (s: string) =>
      (await ApiClient("Get point coordinates")).get(
        `https://nominatim.openstreetmap.org/search?q=${s}&format=json&accept-language=en`
      )
  };
};
