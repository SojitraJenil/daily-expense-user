import React, { useEffect, useState } from 'react';
import Login from 'component/login/Login';
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
