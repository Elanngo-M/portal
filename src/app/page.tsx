'use client';

import Link from "next/link";
import { Button, Paper, Stack, Typography, Box, IconButton } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import styles from './homepage.module.css';
import { useThemeContext } from './ThemeContext'; 
import { useTheme } from '@mui/material/styles';

export default function Home() {
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  return (
    <div className={mode === "light" ? styles.container : styles.container_dark}>
      <Paper
        elevation={4}
        className={styles.card}
        sx={{
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Link href="/login/teacher">
            <Button
              startIcon={<AssignmentIndIcon />}
              variant={mode === 'light' ? 'outlined' : 'contained'}
              fullWidth
              className={styles.button}
              sx={{
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                bgcolor: mode === 'dark' ? theme.palette.grey[800] : undefined,
              }}
            >
              Login as Teacher
            </Button>
          </Link>

          <Link href="/login/student">
            <Button
              startIcon={<SchoolIcon />}
              color="success"
              variant="contained"
              fullWidth
              className={styles.button}
              sx={{
                color: theme.palette.getContrastText(theme.palette.success.main),
              }}
            >
              Login as Student
            </Button>
          </Link>

          <Link href="/signup">
            <Button
              startIcon={<ExitToAppIcon />}
              color="primary"
              variant="contained"
              fullWidth
              className={styles.button}
              sx={{
                color: theme.palette.getContrastText(theme.palette.primary.main),
              }}
            >
              Signup
            </Button>
          </Link>
        </Stack>
      </Paper>
    </div>
  );
}
