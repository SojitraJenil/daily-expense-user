import React, { useEffect, useState } from 'react';
import DefaultLayout from 'component/layout/LandingLayout';
import Login from 'component/login/Login';
import Auth from './auth/Auth';
import Landing from './landing';

const Index = () => {
  const metadata = {
    title: "Daily Expense",
    description: "Play Ludo online with friends and family on FireLudo, the ultimate Ludo gaming platform."
  };

  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(true)
  }, [])

  return (
    <div>
      {/* <Auth /> */}
      {isAuth ? <Login /> : <Landing metadata={metadata} />}
    </div>
  );
};

export default Index;
