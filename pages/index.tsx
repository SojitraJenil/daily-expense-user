import AddExpense from "component/addexpense/Addexpense";
import BottomBar from "component/bottombar/BottomBar";
import Navbar from "component/navbar/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={`${inter.className}`}>
      <div className="w-full max-w-lg h-screen mx-auto bg-slate-300 border border-black flex flex-col">
        <div className="flex-grow overflow-auto pb-16"> {/* Ensure content area is scrollable and has padding bottom for BottomBar */}
          <Navbar />
          <AddExpense />
        </div>
        <BottomBar />
      </div>
    </div>
  );
}
