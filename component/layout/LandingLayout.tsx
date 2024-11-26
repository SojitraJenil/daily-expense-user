import React, { useEffect, Suspense, lazy } from "react";
import Navbar from "component/navbar/Navbar";
import BottomBar from "component/bottombar/BottomBar";
import Home from "component/home/Home";
import { useAtom } from "jotai";
import { NavigateNameAtom } from "atom/atom";
import Profile from "component/profile/Profile";
import { Box, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import Fuel from "component/fuel/Fuel";
import Chat from "component/chat/Chat";
import Record from "component/record/Record";

const LandingLayout = () => {
  const [isNavigate, setIsNavigate] = useAtom(NavigateNameAtom);

  useEffect(() => {
    // Log the navigation change or preload component-specific data
    console.log(`Navigated to: ${isNavigate}`);

    // Example: Fetch data or perform actions based on the current view
    if (isNavigate === "Fuel") {
      // Fetch fuel-related data or initialize state
      console.log("Preloading Fuel data...");
    } else if (isNavigate === "Record") {
      // Fetch records or initialize state
      console.log("Preloading Record data...");
    }
  }, [isNavigate]); // Dependency array ensures it runs when `isNavigate` changes

  return (
    <div className="w-full max-w-lg h-screen mx-auto bg-white border border-l flex flex-col">
      {isNavigate !== "chat" && <Navbar />}
      <div className="flex-grow overflow-auto mt-10">
        {isNavigate === "Home" && <Home />}
        <Suspense
          fallback={
            <Box className="flex justify-center items-center h-full my-[250px]">
              <CircularProgress />
            </Box>
          }
        >
          {isNavigate === "Fuel" && <Fuel />}
          {isNavigate === "Record" && <Record />}
          {isNavigate === "Profile" && <Profile />}
          {isNavigate === "chat" && <Chat />}
        </Suspense>
      </div>
      {isNavigate !== "chat" && (
        <BottomBar isNavigate={isNavigate} onNavigate={setIsNavigate} />
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(LandingLayout), { ssr: false });
