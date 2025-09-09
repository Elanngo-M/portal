"use client";

import { Logout1 } from "@/app/actions/auth";
import { RootState } from "@/redux_files/state/store";
import { Logout } from "@mui/icons-material";
import AdbIcon from "@mui/icons-material/Adb";
import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStudentReduxData } from "../lib/utils";

export default function Studentboard() {
  const student = useSelector((selector: RootState) => selector.StudentData);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(()=>{
    setStudentReduxData(dispatch);
  },[])

  const [state, action, pending] = useActionState(Logout1, undefined);

  useEffect(() => {
    if (state?.success) {
      localStorage.removeItem("UserData");
      router.push("/login");
    }
  }, [state, router]);

  const pages = [`Email: ${student.data.email}`, `Name: ${student.data.name}`];

  function ResponsiveAppBar() {
    return (
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <form action={action}>
                <Button
                  startIcon={<Logout />}
                  sx={{ my: 2, color: "white" }}
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


  function AssignmentList(){
    return (
      student.assignments.map((assignment:any)=>{
        return(<p key={assignment.name}>Name:{assignment.name}</p>)
      })
    );
  }
  return (
    <div>
      <ResponsiveAppBar />
      <h3>Assignment List</h3>
      <AssignmentList/>
    </div>
  );
}
