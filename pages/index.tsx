import React, { useEffect, useState } from "react";
import Login from "component/login/Login";
import Landing from "./landing";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Index = () => {
  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    const authToken = cookies.get("auth-token");
    if (authToken && authToken.mobileNumber) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  return <div>{isAuth ? <Landing /> : <Login />}</div>;
};

export default Index;
