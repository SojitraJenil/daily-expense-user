import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DownloadIcon from "@mui/icons-material/Download";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { useAtom } from "jotai";
import { NavigateNameAtom } from "atom/atom";

const Navbar = () => {
  const router = useRouter();
  const cookies = new Cookies();
  const [navigateName] = useAtom(NavigateNameAtom);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstallable, setIsInstallable] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true); // Show the install button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleAppDownload = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        alert("This app is already installed!");
      } else {
        alert(
          "To install the app, please add it to your home screen from the browser menu."
        );
      }
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleAdmin = () => {
    router.push("/admin");
  };

  const handleLogout = () => {
    cookies.remove("token");
    cookies.remove("UserId");
    cookies.remove("mobileNumber");
    router.push("/login");
    handleMobileMenuClose();
  };

  // const handleProfile = () => {
  //   cookies.remove("token");
  //   router.push("/profile");
  //   handleMobileMenuClose();
  // };

  const menuId = "primary-search-account-menu";

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {isInstallable && (
        <MenuItem onClick={handleAppDownload}>
          <IconButton size="small" aria-label="Download App" color="inherit">
            <DownloadIcon />
          </IconButton>
          <Typography variant="body1">Download App</Typography>
        </MenuItem>
      )}
      <MenuItem onClick={handleAdmin}>
        <IconButton size="small" aria-label="Admin" color="inherit">
          <AdminPanelSettingsIcon />
        </IconButton>
        <Typography variant="body1">Admin</Typography>
      </MenuItem>
      {/* <MenuItem onClick={handleProfile}>
        <IconButton size="small" aria-label="Profile" color="inherit">
          <AccountCircle />
        </IconButton>
        <Typography variant="body1">Profile</Typography>
      </MenuItem> */}
      <MenuItem onClick={handleLogout}>
        <IconButton size="small" aria-label="Logout" color="inherit">
          <LogoutIcon />
        </IconButton>
        <Typography variant="body1">Logout</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          width: { xs: "100%", md: "512px", sm: "512px" }, // 100% width for small screens, 300px for medium and up
          left: 0,
          margin: "auto",
          zIndex: 1200,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {navigateName}
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={(event) => setMobileMoreAnchorEl(event.currentTarget)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
};

export default Navbar;
