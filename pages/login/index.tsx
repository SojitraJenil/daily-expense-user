/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import Login from "../../component/login/Login";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";

export default function index() {
  const cookies = new Cookies();
  const router = useRouter();

  useEffect(() => {
    const authToken = cookies.get("token");
    if (authToken) {
      console.log("AA1");
      router.push("/landing");
    } else {
      console.log("BB1");
      router.push("/login");
    }
  }, []);

  return (
    <div>
      <Login />
    </div>
  );
}
