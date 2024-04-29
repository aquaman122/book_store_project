import { ResetPassword } from "../pages/ResetPassword";
import { SignupProps } from "../pages/Signup";
import { httpClient } from "./http";

export const signup = async (userData: SignupProps) => {
  const response = await httpClient.post("/users/join", userData);
  return response.data;
};

export const resetRequest = async (data: ResetPassword) => {
  const response = await httpClient.post("users/reset", data);
  return response.data;
};

export const resetPassword = async (data: ResetPassword) => {
  const response = await httpClient.put("users/reset", data);
  return response.data;
};

interface LoginResponse {
  token: string;
}

export const login = async (data: SignupProps) => {
  try {
    const response = await httpClient.post<LoginResponse>("users/login", data); 
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401 && error.response.data.message === '로그인 세션이 만료되었습니다. 다시 로그인해주세요.') {
      // 로그인 세션이 만료되었을 때 에러가 발생하면, 로그인 페이지로 리다이렉트하지 않고 에러를 반환합니다.
      throw new Error("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
    } else {
      // 그 외의 경우에는 일반적인 에러 처리를 수행합니다.
      throw error;
    }
  }
}