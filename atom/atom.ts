// userAtom.ts
import { atom } from "jotai";

export interface User {
  [x: string]: string;
  id: string;
  name: string;
  mobileNumber: string;
  password: string;
}

export const userAtom = atom<User[]>([]);
