import { login, resetPassword, resetRequest, signup } from "@/api/auth.api";
import { useAuthStore } from "@/store/authStore"
import { useNavigate } from "react-router-dom";
import { useAlert } from "./useAlert";
import { LoginProps } from "@/pages/Login";
import { SignupProps } from "@/pages/Signup";
import { ResetPassword } from "@/pages/ResetPassword";
import { useState } from "react";

export const useAuth = () => {
  const { storeLogin } = useAuthStore();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const userLogin = (data: LoginProps) => {
    login(data).then((res) => {
      // 상태변화
      storeLogin(res.token);

      showAlert("로그인 완료되었습니다.");
      navigate("/")
    },(error) => {
      showAlert("로그인이 실패했습니다.");
    });
  }

  const userSignup = (data: SignupProps) => {
    signup(data).then(() => {
      // 성공
      showAlert("회원가입이 완료되었습니다.");
      navigate("/login");
    });
  }

  const userResetPassword = (data: ResetPassword) => {
    resetPassword(data).then(() => {
      showAlert("비밀번호가 초기화되었습니다.");
      navigate("/login");
    });
  }

  const [ resetRequested, setResetRequested ] = useState(false);

  const userResetRequest = (data: ResetPassword) => {
    // 요청
    resetRequest(data).then(() => {
      setResetRequested(true);
    });
  }

  return { userLogin, userSignup, userResetPassword, userResetRequest, resetRequested };
}