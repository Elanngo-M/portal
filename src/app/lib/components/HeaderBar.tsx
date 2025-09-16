"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Student, Teacher } from "../types";

interface HeaderBarProps {
  title: string;
  teacher?: Teacher | null;
  action: any;
  pending: boolean;
  student: Student | null;
}

export default function HeaderBar({ title, teacher, action, pending , student }: HeaderBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ color: "white", mx: 2 }}>
              {title}
            </Typography>
            
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <AccountCircle />
            </IconButton>
              <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
  transformOrigin={{ vertical: "top", horizontal: "right" }}
  sx={{ mt: 1 }}
>
  <Box sx={{ px: 2, py: 1.5 , gap:2}}>
    <Typography variant="subtitle1" fontWeight="bold">
      {teacher?.name || student?.data.name}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {teacher?.email || student?.email}
    </Typography>
    <Typography variant="subtitle2" fontWeight="semi-bold" >
      {teacher?.subject}
    </Typography>
  
    <form action={action}>
      <Button
        type="submit"
        disabled={pending}
        sx={{color: "black", width:'100%', justifyContent:'flex-start', display:'flex',padding:0, paddingY:1 }}
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
