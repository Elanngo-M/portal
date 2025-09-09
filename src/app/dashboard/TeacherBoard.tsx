"use client";

import { Logout1 } from "@/app/actions/auth";
import { RootState } from "@/redux_files/state/store";
import { Logout } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserLocalData, setAllStudentReduxData, setTeacherReduxData } from "../lib/utils";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

export default function Teacherboard() {
  const Allstudent = useSelector((selector: RootState)=> selector.AllStudentData);
  const teacher = useSelector((selector: RootState)=>selector.TeacherData);
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [state, action, pending] = useActionState(Logout1, undefined);
  useEffect(() => {
    if (state?.success) {
      localStorage.removeItem("UserData");
      router.push("/login");
    }
  }, [state, router]);
  useEffect(()=>{
    setTeacherReduxData(dispatch);
    setAllStudentReduxData(dispatch);
  },[router])




const pages = [`Email: ${teacher.email}` , `Name: ${teacher.name}` , `Subject: ${teacher.subject}`];

function ResponsiveAppBar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <form action={action}>
        <Button
          startIcon={<Logout />}
          sx={{ my: 2, color: 'white'}}
          type="submit"
          disabled={pending}
        >
          Logout
        </Button>
      </form>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}


  return (
    <div>
      <ResponsiveAppBar/>
      <h2>All Student Names:</h2>
      {Allstudent.students?.map((student:any)=>{
          return(
          <p key={student.email}>{student.data.name}</p>
        )
      })}
      
    </div>
  );
}
