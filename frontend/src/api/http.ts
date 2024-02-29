import axios, { AxiosRequestConfig } from "axios";
import { getToken, removeToken } from "../store/authStore";

const BASE_URL = "http://localhost:5678";
const DEFAULT_TIMEOUT = 3000000000;

// getToken은 axiosInstance 가 생성될떄 한번만 호출 되기때문에 설정 바꿈
const setAuthorizationHeader = () => {
  const token = getToken();
  return token ? `${token}` : "";
};

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    withCredentials: true,
    ...config,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      config.headers['Authorization'] = setAuthorizationHeader();
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {return response;},
    (error) => {
      // 로그인 만료 처리
      if (error.response.status === 401) {
        removeToken();
        window.location.href = "/login";
        return;
      }
      return Promise.reject(error);
    }
  )

  return axiosInstance;
}

export const httpClient = createClient();