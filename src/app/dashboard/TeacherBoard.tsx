"use client";

import { Logout1 } from "@/app/actions/auth";
import { RootState } from "@/redux_files/state/store";
import { Logout } from "@mui/icons-material";
import AdbIcon from "@mui/icons-material/Adb";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllStudentReduxData,
  setTeacherReduxData
} from "../lib/utils";
import { assignment } from "../lib/types";
import { Rating } from "@mui/material";
import { SubmitRating } from "../actions/assignment";

export default function Teacherboard() {
  const Allstudent = useSelector(
    (selector: RootState) => selector.AllStudentData
  );
  const teacher = useSelector((selector: RootState) => selector.TeacherData);
  const router = useRouter();
  const dispatch = useDispatch();

  const [state, action, pending] = useActionState(Logout1, undefined);
  const [rateState , rateAction , ratePending] = useActionState(SubmitRating , undefined);
  const [rating , setRating]= useState<any>(0);
  useEffect(() => {
    if (state?.success) {
      localStorage.removeItem("UserData");
      router.push("/login");
    }
  }, [state, router]);


  useEffect(() => {
    setTeacherReduxData(dispatch);
    setAllStudentReduxData(dispatch);
  }, [router]);

  const pages = [
    `Email: ${teacher.email}`,
    `Name: ${teacher.name}`,
    `Subject: ${teacher.subject}`,
  ];

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

  function SubmitedList() {
  return (
    <div>
      <h2>Assignments</h2>
      
      {Allstudent.assignments.map((assignment: assignment) => (
        <div key={assignment.name} style={{ marginBottom: "1rem" }}>
          <p><strong>Name:</strong> {assignment.name}</p>
          <p><strong>Due Date:</strong> {assignment.dueDate}</p>
          <h3>Submitted Students</h3>
          {assignment.submitted.map((s: any, index: number) => {
            const isGraded = s.grade != null;
            if (!isGraded) {
              return (
                <div key={index} style={{ paddingLeft: "1rem" }}>
                  <p><strong>Student:</strong> {s.student}</p>
                  <p><strong>Answer:</strong> {s.answer}</p>
                  <form action={rateAction}>
                    <input type="hidden" name="assignmentName" value={assignment.name} />
                    <input type="hidden" name="studentName" value={s.student} />
                    <input type="hidden" name="rating" value={rating} />
                    <Rating
                      name={`rating-${assignment.name}-${s.student}`}
                      defaultValue={s.rating ?? 0}
                      precision={0.5}
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                      value={rating}
                    />
                    <Button
                      sx={{ my: 2, color: "white" }}
                      type="submit"
                      disabled={ratePending}
                      variant="contained"
                    >
                      Submit Grade
                    </Button>
                  </form>
                </div>
              );
            }

            return <p key={s.student}>{s.student}</p>;
          })}
        </div>
      ))}
    </div>
  );
}




  return (
    <div>
      <ResponsiveAppBar />
      <h2>All Student Names:</h2>
      {Allstudent.students?.map((student: any) => {
        return <p key={student.email}>{student.data.name}</p>;
      })}
      <Button>
        <Link href={"/dashboard/addAssignment"}>Add assignment</Link>
      </Button>
      <SubmitedList/>
    </div>
  );
}
