import React, { useEffect, useState } from 'react';
import DefaultLayout from 'component/layout/LandingLayout';
import Login from 'component/login/Login';
import Auth from './auth/Auth';
import Landing from './landing';

const Index = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(true)
  }, [])

  return (
    <div>
      {isAuth ? <Login /> : <Landing />}
    </div>
  );
};

export default Index;
