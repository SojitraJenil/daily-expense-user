import dynamic from "next/dynamic";

const Login = dynamic(() => import("component/login/Login"));

const Index: React.FC = () => {
  return (
    <div>
      <Login />
    </div>
  );
};

export default Index;
