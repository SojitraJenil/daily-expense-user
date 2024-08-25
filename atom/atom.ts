import { atom } from "jotai";

export interface User {
  [x: string]: string;
  id: string;
  name: string;
  mobileNumber: string;
  password: string;
  email: string;
}

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
