"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux_files/state/store";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useDB } from "./lib/utils";
import { ThemeProvider, useThemeContext } from "./ThemeContext";
import { Box, IconButton } from "@mui/material";
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function ThemeToggle() {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <Box sx={{ position: 'fixed', top: 12, right: 16, zIndex: 999 }}>
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Box>
  );
}

import { usePathname } from "next/navigation";
import HeaderBar from "./lib/components/HeaderBar";
import { Logout1 } from "./actions/auth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login/teacher" || pathname === "/signup" || pathname == "/" || pathname === "/login/student" || pathname === "/dashboard/addAssignment" ;

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {isAuthPage && (
            <ThemeToggle/>
          )}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
