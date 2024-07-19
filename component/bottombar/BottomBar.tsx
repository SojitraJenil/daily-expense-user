import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CalculateIcon from "@mui/icons-material/Calculate";
import ChatIcon from "@mui/icons-material/Chat";

export default function BottomBar({
  isNavigate,
  onNavigate,
}: {
  isNavigate: string;
  onNavigate: (navigateName: string) => void;
}) {
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
        "& .Mui-selected": {
          backgroundColor: "black",
          color: "white",
        },
      }}
    >
      <BottomNavigationAction
        value="Home"
        label="Home"
        className="py-[10px] bg-slate-200"
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        value="graph"
        label="Chart"
        icon={<LeaderboardIcon />}
        className="bg-slate-100"
      />
      <BottomNavigationAction
        value="Fuel"
        label="Fuel"
        icon={<CalculateIcon />}
        className="bg-slate-200"
      />
      <BottomNavigationAction
        value="chat"
        className="bg-slate-100"
        label="Chat"
        icon={<ChatIcon />}
      />
    </BottomNavigation>
  );
}
