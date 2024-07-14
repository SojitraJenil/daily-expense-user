import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DownloadIcon from "@mui/icons-material/Download";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { MenuItem } from "@mui/material";

const Navbar = () => {
  const router = useRouter();
  const cookies = new Cookies();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [installPrompt, setInstallPrompt] = React.useState<any>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleAdmin = () => {
    router.push("/admin");
  };

  const handleLogout = () => {
    cookies.remove("token");
    router.push("/login");
    handleMobileMenuClose();
  };

  const HandleAppDownload = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choiceResult = await installPrompt.userChoice;

        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }

        setInstallPrompt(null);
      } catch (error) {
        console.error("Error prompting installation:", error);
      }
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
      <MenuItem onClick={HandleAppDownload}>
        <IconButton size="small" aria-label="Download App" color="inherit">
          <DownloadIcon />
        </IconButton>
        <Typography variant="body1">Download App</Typography>
      </MenuItem>
      <MenuItem onClick={handleAdmin}>
        <IconButton size="small" aria-label="Admin" color="inherit">
          <AdminPanelSettingsIcon />
        </IconButton>
        <Typography variant="body1">Admin</Typography>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <IconButton size="small" aria-label="Logout" color="inherit">
          <LogoutIcon />
        </IconButton>
        <Typography variant="body1">Logout</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap component="div"></Typography>
          <Box sx={{ flexGrow: 1 }} />
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
