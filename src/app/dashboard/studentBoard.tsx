"use client";

import { Logout1 } from "@/app/actions/auth";
import { RootState } from "@/redux_files/state/store";
import { Logout } from "@mui/icons-material";
import AdbIcon from "@mui/icons-material/Adb";
import { Button, Rating, TextField } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStudentReduxData, submitAsstoRedux } from "../lib/utils";
import { submitAssignment } from "@/redux_files/user/studentSlice";
import { assignment, assignmentSubmit } from "../lib/types";
import { SubmitAssignmentAnswer } from "../actions/assignment";
import { useState } from "react";

export default function Studentboard() {

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

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

 

function submitAss(assignmentName: string, assignmentSubject: string, assignmentTeacher: string, minCount: number) {
  const answerText = answers[assignmentName] || "";
  const wordCount = answerText.trim().split(/\s+/).length;

  if (wordCount < minCount) {
    alert(`Answer must be at least ${minCount} words. Current: ${wordCount}`);
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const myassignment: assignmentSubmit = {
    name: assignmentName,
    studentName: student.data.email,
    subject: assignmentSubject,
    teacher: assignmentTeacher,
    date: today,
    answer: answerText,
  };

  const formData = new FormData();
  Object.entries(myassignment).forEach(([key, value]) => formData.append(key, value));

  SubmitAssignmentAnswer({}, formData).then((res) => {
    if (res?.success) {
      submitAsstoRedux(dispatch, myassignment);
      console.log("Assignment submitted successfully");
    } else {
      console.error("Submission failed:", res?.error || res?.details);
    }
  });
}



  const pages = [`Email: ${student.data.email}`, `Name: ${student.data.name}`];
  const today = new Date().toISOString().slice(0, 10);
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


  
function AssignmentList() {
  return student.assignments.map((assignment: assignment) => {
    const hasSubmitted = assignment.submitted?.some(
      (s) => s.student === student.data.email
    );

    if (!hasSubmitted) {
      return (
        <div key={assignment.name} style={{ marginBottom: "20px" }}>
          <p><strong>Name:</strong> {assignment.name}</p>
          <p><strong>Subject:</strong> {assignment.subject ?? ""}</p>
          <p><strong>Assigned By:</strong> {assignment.teacher ?? ""}</p>
          <p><strong>MinCount:</strong> {assignment.minCount ?? ""}</p>

          <TextField
            label="Your Answer"
            multiline
            fullWidth
            rows={4}
            value={answers[assignment.name] || ""}
            onChange={(e) =>
              setAnswers({ ...answers, [assignment.name]: e.target.value })
            }
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />

          <Button
            variant="contained"
            onClick={() =>
              submitAss(
                assignment.name,
                assignment.subject,
                assignment.teacher,
                Number(assignment.minCount) || 0
              )
            }
          >
            Submit
          </Button>
        </div>
      );
    }

    return null;
  });
}

function GradedAssignmentList() {
  return student.assignments.map((assignment: assignment) => {
    const submission = assignment.submitted?.find(
      (s) => s.student === student.data.email
    );

    const hasSubmitted = !!submission;
    const hasGraded = submission?.grade != null;

    if (hasSubmitted && hasGraded) {
      return (
        <div key={assignment.name} style={{ marginBottom: "20px" }}>
          <p><strong>Name:</strong> {assignment.name}</p>
          <p><strong>Subject:</strong> {assignment.subject ?? ""}</p>
          <p><strong>Assigned By:</strong> {assignment.teacher ?? ""}</p>
          <Rating name="read-only" value={submission.grade} readOnly />
        </div>
      );
    }

    return null;
  });
}



  return (
    <div>
      <ResponsiveAppBar />
      <h3>Assignment List</h3>
      <AssignmentList/>
      <h3>Graded Assignment List</h3>
      <GradedAssignmentList/>
    </div>
  );
}
