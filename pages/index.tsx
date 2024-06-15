import { Inter } from "next/font/google";
import Navbar from "../component/navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={` ${inter.className}`}>
      <Navbar />
    </div>
  );
}
