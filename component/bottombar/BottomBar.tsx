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

  // Synchronize local state with the parent prop
  React.useEffect(() => {
    setValue(isNavigate); // Update state if isNavigate changes externally
  }, [isNavigate]);

  // Handle value changes
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    onNavigate(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      sx={{
        backgroundColor: "whitesmoke",
        padding: "2px 0px",
        "& .Mui-selected": {
          backgroundColor: "black",
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
