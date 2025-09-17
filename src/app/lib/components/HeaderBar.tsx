"use client";

import { useThemeContext } from "@/app/ThemeContext";
import AccountCircle from "@mui/icons-material/AccountCircle";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  styled,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";
import { Student, Teacher } from "../types";

interface HeaderBarProps {
  title: string;
  teacher?: Teacher | null;
  action: any;
  pending: boolean;
  student: Student | null;
}

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function HeaderBar({
  title,
  teacher,
  action,
  pending,
  student,
}: HeaderBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { mode, toggleTheme } = useThemeContext();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getProfileImageUrl = () => {
    const blob = teacher?.profileImage || student?.data?.profileImage;
    return blob ? URL.createObjectURL(blob) : null;
  };

  const profileImageUrl = getProfileImageUrl();

  useEffect(() => {
    return () => {
      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [profileImageUrl]);

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 20 20'><path fill='${encodeURIComponent(
          '#fff'
        )}' d='M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z'/></svg>")`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 20 20'><path fill='${encodeURIComponent(
        '#fff'
      )}' d='M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z'/></svg>")`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
  },
}));

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: mode === "light" ? "primary.main" : "background.default" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ color: "white", mx: 2 }}>
              {title}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Theme Toggle Button */}

            {/* User Menu */}
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
            >
              {profileImageUrl ? (
                <Avatar alt="Profile" src={profileImageUrl} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{ mt: 1 }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {teacher?.name || student?.data.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {teacher?.email || student?.email}
                </Typography>
                <Typography variant="subtitle2" fontWeight="semi-bold">
                  {teacher?.subject}
                </Typography>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography>Dark Theme:</Typography>
                  <MaterialUISwitch
  onChange={toggleTheme}
  checked={mode === "dark"}
  title="Dark mode"
/>

                </div>

                <form action={action}>
                  <Button
                    type="submit"
                    disabled={pending}
                    sx={{
                      width: "100%",
                      justifyContent: "flex-start",
                      paddingY: 1,
                      color: mode === "light" ? "text.primary" : "white",
                    }}
                  >
                    Logout
                  </Button>
                </form>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
