// BottomBar.tsx
import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CalculateIcon from "@mui/icons-material/Calculate";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface BottomBarProps {
  isNavigate: string;
  onNavigate: (navigateName: string) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ isNavigate, onNavigate }) => {
  const [value, setValue] = React.useState<string>(isNavigate);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onNavigate(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        handleChange(newValue);
      }}
      showLabels
      sx={{
        backgroundColor: "whitesmoke",
        padding: "2px 0px",
        "& .Mui-selected": {
          backgroundColor: "black",
          padding: "2px 0px",
          color: "white",
        },
      }}
    >
      <BottomNavigationAction value="Home" label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction
        value="Record"
        label="Record"
        icon={<AccountBalanceWalletIcon />}
      />
      <BottomNavigationAction
        value="Fuel"
        label="Fuel"
        icon={<CalculateIcon />}
      />
      <BottomNavigationAction
        value="Profile"
        label="Profile"
        icon={<AccountCircleIcon />}
      />
    </BottomNavigation>
  );
};

export default BottomBar;
