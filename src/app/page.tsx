'use client'
import Image from "next/image";
import Link from "next/link";
import { Button } from "@mui/material";
import styles from  './homepage.module.css'
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function Home() {
  return (
    <div className={styles.container}>
      
      <Link href="/login/teacher">
        <Button startIcon={<AssignmentIndIcon/>}  variant="outlined">
        Login as Teacher
        </Button>
      </Link>
      
      <Link href="/login/student">
        <Button startIcon={<SchoolIcon/>} color="success"  variant="contained">
          Login as Student
        </Button>    
      </Link>

      <Link href="/signup">
        <Button startIcon={<ExitToAppIcon/>} color="primary"  variant="contained">
          Signup
        </Button>    
      </Link>
    </div>
  );
}

