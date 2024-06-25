import { TCategory } from "@app/interfaces/places";
import { ILoginData, IUserData } from "@app/interfaces/user";
import { AxiosInstance } from "axios";

export const auth = (
  ApiClient: (methodName?: string) => Promise<AxiosInstance>
) => {
  return {
    claims: async () =>
      (await ApiClient("Check user claims")).get(`/claims`),

    login: async (data: ILoginData) => (await ApiClient("Login user")).post(`/login`, data),

    logout: async () => (await ApiClient("Logout")).post(`/logout`),

    refresh: async () => (await ApiClient("Get refresh token")).get(`/refresh_token`),
  };
};
