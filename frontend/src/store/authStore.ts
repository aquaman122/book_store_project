import { create } from "zustand";

interface StoreState {
  isloggedIn: boolean;
  storeLogin: (token: string) => void;
  storeLogout: () => void;
}

export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log(1);
  return token;
}

const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
}

export const useAuthStore = create<StoreState>((set) => ({
  isloggedIn: getToken() ? true : false, // 초기값
  storeLogin: (token: string) => {
    set({isloggedIn: true});
    setToken(token);
  },
  storeLogout: () => {
    set({ isloggedIn: false});
    removeToken();
  }
}))