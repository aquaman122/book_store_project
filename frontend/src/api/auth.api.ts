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
    if (error.response && error.response.status === 400) {
      throw new Error("Unauthorized");
    } else {
      throw new Error("Unauthorized");
    }
  }
}