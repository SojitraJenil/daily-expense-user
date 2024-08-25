import { atom } from "jotai";

export interface User {
  [x: string]: string;
  id: string;
  name: string;
  mobileNumber: string;
  password: string;
  email: string;
}

export const userAtom = atom<User[]>([]);
export const userProfile = atom<any>([]);
export const userProfileName = atom<any>([]);
export const userGraphExpense = atom<any>([]);

export const TotalExpense = atom<any>([]);
export const TotalIncome = atom<any>([]);
export const TotalInvest = atom<any>([]);

const getInitialNavigateState = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("navigateName") || "Home";
  }
  return "Home";
};

export const NavigateNameAtom = atom(getInitialNavigateState());

NavigateNameAtom.onMount = (setAtom) => {
  const handler = () => {
    setAtom(getInitialNavigateState());
  };
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("storage", handler);
  };
};
