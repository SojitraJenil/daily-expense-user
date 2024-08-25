import React, { useState, Suspense, lazy, useEffect } from "react";
import Navbar from "component/navbar/Navbar";
import BottomBar from "component/bottombar/BottomBar";
import Home from "component/home/Home";
import { atom, useAtom } from "jotai";
import { NavigateNameAtom } from "atom/atom";
import Profile from "component/profile/Profile";
import { Box, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import Fuel from "component/fuel/Fuel";
import Chat from "component/chat/Chat";
import Record from "component/record/Record";

const LandingLayout = () => {
  const [isNavigate, setIsNavigate] = useAtom(NavigateNameAtom); // Use atom to manage navigation state

  useEffect(() => {
    localStorage.setItem("navigateName", isNavigate);
  }, [isNavigate]);

  const handleNavigate = (navigateName: string) => {
    setIsNavigate(navigateName); // Update the atom state
  };

  return (
    <div className="w-full max-w-lg h-screen mx-auto bg-white border border-l flex flex-col">
      <div className="flex-grow overflow-auto">
        {isNavigate === "chat" ? "" : <Navbar />}
        <div className="mt-10">
          {isNavigate === "Home" && <Home />}
          <Suspense
            fallback={
              <div>
                {" "}
                <Box className="flex justify-center items-center h-full my-[250px]">
                  <CircularProgress />
                </Box>
              </div>
            }
          >
            {isNavigate === "Fuel" && <Fuel />}
            {isNavigate === "Record" && <Record />}
            {isNavigate === "Profile" && <Profile />}
            {isNavigate === "chat" && <Chat />}
          </Suspense>
        </div>
      </div>
      {isNavigate !== "chat" && (
        <BottomBar isNavigate={isNavigate} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(LandingLayout), { ssr: false });
