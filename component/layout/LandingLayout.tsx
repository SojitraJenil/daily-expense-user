import React, { useState, Suspense, lazy } from "react";
import Navbar from "component/navbar/Navbar";
import BottomBar from "component/bottombar/BottomBar";
import Home from "component/home/Home";
import { atom, useAtom } from "jotai";
import { NavigateNameAtom } from "atom/atom";
import Profile from "component/profile/Profile";

const Graph = lazy(() => import("component/graph/Graph"));
const Chat = lazy(() => import("component/chat/Chat"));
const Calculator = lazy(() => import("component/calc/Calculator"));

const LandingLayout = () => {
  const [isNavigate, setIsNavigate] = useAtom(NavigateNameAtom); // Use atom to manage navigation state

  const handleNavigate = (navigateName: string) => {
    setIsNavigate(navigateName); // Update the atom state
  };

  return (
    <div className="w-full max-w-lg h-screen mx-auto bg-slate-300 border border-black flex flex-col">
      <div className="flex-grow overflow-auto">
        <Navbar />
        <div className="mt-10">
          {isNavigate === "Home" && <Home />}
          <Suspense fallback={<div>Loading content...</div>}>
            {isNavigate === "graph" && <Graph />}
            {isNavigate === "Fuel" && <Calculator />}
            {isNavigate === "Profile" && <Profile />}
            {isNavigate === "chat" && <Chat />}
          </Suspense>
        </div>
      </div>
      <BottomBar isNavigate={isNavigate} onNavigate={handleNavigate} />
    </div>
  );
};

export default LandingLayout;
