"use client";

import { Logout1 } from "@/app/actions/auth";
import { RootState } from "@/redux_files/state/store";
import { Logout } from "@mui/icons-material";
import AdbIcon from "@mui/icons-material/Adb";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllStudentReduxData, setTeacherReduxData } from "../lib/utils";
import { SubmitRating } from "../actions/assignment";
import TeacherAssignmentList from "../lib/components/teacherAssignmnetList";

export default function Teacherboard() {
  const Allstudent = useSelector((state: RootState) => state.AllStudentData);
  const teacher = useSelector((state: RootState) => state.TeacherData);
  const router = useRouter();
  const dispatch = useDispatch();

  const [state, action, pending] = useActionState(Logout1, undefined);
  const [rateState, rateAction, ratePending] = useActionState(
    SubmitRating,
    undefined
  );
  const [rating, setRating] = useState<number>(0);
  const [tabIndex, setTabIndex] = useState(0);

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

  const teacherAssignments = Allstudent.assignments.filter(
    (a: any) => a.teacher === teacher.email
  );

  console.log(teacherAssignments);

  const pendingAssignments = teacherAssignments.filter(
    (a: any) => a.submitted.length < a.assignedStudents.length
  );

  const pendingAssignmentsWithMissingStudents = pendingAssignments.map((assignment: any) => {
  const submittedEmails = assignment.submitted.map((s: any) => s.student);
  const missingStudents = assignment.assignedStudents.filter(
    (email: string) => !submittedEmails.includes(email)
  );

  return {
    ...assignment,
    missingStudents,
  };
});


  const nonGradedAssignments = teacherAssignments.filter((a: any) =>
    a.submitted.some((s: any) => s.grade == null)
  );

  const gradedAssignments = teacherAssignments.filter((a: any) =>
    a.submitted.some((s: any) => s.grade != null)
  );

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

  function StudentAnalyticsTable({
  students,
  assignments,
}: {
  students: any[];
  assignments: any[];
}) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Total Assignments</strong></TableCell>
            <TableCell><strong>Submitted</strong></TableCell>
            <TableCell><strong>Graded</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students?.map((student: any) => {
            const email = student.email;

            const assignedToStudent = assignments.filter((a: any) =>
              a.assignedStudents.includes(email)
            );

            const submitted = assignedToStudent.filter((a: any) =>
              a.submitted?.some((s: any) => s.student === email)
            );

            const graded = submitted.filter((a: any) =>
              a.submitted?.some((s: any) => s.student === email && s.grade != null)
            );

            return (
              <TableRow key={email}>
                <TableCell>{student.data.name}</TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>{assignedToStudent.length}</TableCell>
                <TableCell>{submitted.length}</TableCell>
                <TableCell>{graded.length}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


  return (
    <div>
      <ResponsiveAppBar />

      <Box sx={{ mt: 4 }}>
        <Tabs
          value={tabIndex}
          onChange={(e, newValue) => setTabIndex(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Student Analytics" />
          <Tab label={`Pending (${pendingAssignments.length})`} />
          <Tab label={`Non-Graded (${nonGradedAssignments.length})`} />
          <Tab label={`Graded (${gradedAssignments.length})`} />
        </Tabs>

        {tabIndex === 0 && (
          <>
            <Button variant="outlined" sx={{ mt: 2 }}>
              <Link href="/dashboard/addAssignment">Add Assignment</Link>
            </Button>
            
<StudentAnalyticsTable
  students={Allstudent.students}
  assignments={teacherAssignments}
/>

          </>
        )}

        {tabIndex === 1 && (
         
<TeacherAssignmentList
  assignments={pendingAssignmentsWithMissingStudents}
  rateAction={rateAction}
  ratePending={ratePending}
  students={Allstudent.students}
  showMissingStudents={true}
/>


        )}

        {tabIndex === 2 && (
          <TeacherAssignmentList
            assignments={nonGradedAssignments}
            rateAction={rateAction}
            ratePending={ratePending}
            students={Allstudent.students}
          />
        )}

        {tabIndex === 3 && (
          <TeacherAssignmentList
            assignments={gradedAssignments}
            rateAction={rateAction}
            ratePending={ratePending}
            students={Allstudent.students}
          />
        )}
      </Box>
    </div>
  );
}
