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
        backgroundColor: "white",
        "& .Mui-selected": {
          backgroundColor: "black",
          color: "white",
        },
      }}
    >
      <BottomNavigationAction
        value="landing"
        label="Home"
        className="py-[10px]"
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        value="graph"
        label="Chart"
        icon={<LeaderboardIcon />}
      />
      <BottomNavigationAction
        value="calc"
        label="Calculator"
        icon={<CalculateIcon />}
      />
      <BottomNavigationAction value="chat" label="Chat" icon={<ChatIcon />} />
    </BottomNavigation>
  );
}
