import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import Login from "component/login/Login";
import Landing from "./landing";

const Index = () => {
  const cookies = new Cookies();
  const [isAuth, setIsAuth] = useState<null | boolean>(null);

  useEffect(() => {
    const authToken = cookies.get("token");
    if (authToken) {
      setIsAuth(true);
      console.log("AA");
    } else {
      setIsAuth(false);
      console.log("BB");
    }
  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  return <div>{isAuth ? <Landing /> : <Login />}</div>;
};

export default Index;
