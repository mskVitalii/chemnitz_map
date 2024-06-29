import { ToastErrorTemplate } from "@app/components/Containers/ToastErrorTemplate";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

import { auth } from "./routes/auth";
import { nominatim } from "./routes/nominatim";
import { places } from "./routes/places";
import { user } from "./routes/user";

const ApiClient = async (methodName = ""): Promise<AxiosInstance> => {
  const config: AxiosRequestConfig = {
    baseURL: "http://localhost:80/api/v1",
    withCredentials: true
  };

  const a = axios.create(config);

  a.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        toast.error("Unathorized");
      } else if (error.response?.status === 403) {
        toast.error("Forbidden");
      } else {
        toast.error(ToastErrorTemplate(methodName, error));
      }
      return Promise.reject(error);
    }
  );

  return a;
};

const ApiClientOuter = async (methodName = ""): Promise<AxiosInstance> => {
  const config: AxiosRequestConfig = {
    baseURL: ""
  };

  const a = axios.create(config);

  a.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status !== 401) {
        toast.error(ToastErrorTemplate(methodName, error));
      }
      return Promise.reject(error);
    }
  );

  return a;
};

const API = {
  auth: auth(ApiClient),
  places: places(ApiClient),
  user: user(ApiClient),
  external: {
    nominatim: nominatim(ApiClientOuter)
  }
};

export default API;
