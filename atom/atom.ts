import { atom } from "jotai";

export interface User {
  id: string;
  name: string;
  mobileNumber: string;
  password: string;
}

export const userAtom = atom<User[]>([]);
