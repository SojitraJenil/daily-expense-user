import useHome from "context/HomeContext";
import dynamic from "next/dynamic";
import Landing from "./landing";
import { useState, useEffect } from "react";

const Login = dynamic(() => import("component/login/Login"));

const Index: React.FC = () => {
  const { mobileNumber, token, userId } = useHome();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <>{token && mobileNumber ? <Landing /> : <Login />}</>;
};

export default Index;
