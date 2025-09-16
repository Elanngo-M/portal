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
  Toolbar,
  Typography
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
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>

            {/* User Menu */}
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
            >
              {profileImageUrl ? (
                <Avatar alt="Profile" src={profileImageUrl}/>
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
