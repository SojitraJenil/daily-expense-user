import { atom } from "jotai";

export interface User {
  [x: string]: string;
  id: string;
  name: string;
  mobileNumber: string;
  password: string;
}

export const userAtom = atom<User[]>([]);
export const userProfile = atom<User[]>([]);
export const NavigateNameAtom = atom("Home"); // Default value set to "landing"
