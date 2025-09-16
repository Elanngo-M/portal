"use client";

import { Logout1 } from "@/app/actions/auth";
import {
  Box,
  Button,
  Container,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import { openDB } from "idb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import HeaderBar from "../lib/components/HeaderBar";
import TeacherAssignmentList from "../lib/components/teacherAssignmnetList";
import { assignment, Student, Teacher } from "../lib/types";
import {
  getAllStudent,
  getAssignment,
  getTeacher,
  myDBversion,
} from "../lib/utils";
import styles from "./dashboard.module.css";
import { useThemeContext } from "../ThemeContext";

export default function Teacherboard() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const router = useRouter();
  const {mode} = useThemeContext();
  const [state, action, pending] = useActionState(Logout1, undefined);
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<assignment[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let current: any = localStorage.getItem("Current");
      current = JSON.parse(current);
      const teach = await getTeacher(current.email);
      const ass = (await getAssignment(current.email, "teacher")) ?? [];
      const stu = await getAllStudent();
      setTeacher(teach);
      setAssignments(ass);
      setStudentData(stu);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (state?.success) {
      localStorage.removeItem("Current");
      router.push("/login");
    }
  }, [state, router]);

  async function handleRatingSubmit({
    assignmentName,
    studentName,
    rating,
    teacher,
    remarks
  }: {
    assignmentName: string;
    studentName: string;
    rating: number;
    teacher: string;
    remarks:string;
  }) {
    try {
      const assignmentIndex = assignments.findIndex(
        (a) => a.name === assignmentName && a.teacher === teacher
      );

      if (assignmentIndex === -1) return;

      const assignment = assignments[assignmentIndex];
      const submissionIndex = assignment.submitted.findIndex(
        (s) => s.student === studentName
      );

      if (submissionIndex === -1) return;

      assignment.submitted[submissionIndex].grade = Number(rating);
      assignment.submitted[submissionIndex].remarks = remarks;
      console.log(remarks);
      const myDB = await openDB("MyDB", myDBversion);
      await myDB.put("Assignments", assignment);

      const AllAssignments = await getAssignment(teacher, "teacher");
      setAssignments(AllAssignments);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  }

  const pendingAssignments = assignments.filter(
    (a: any) => a.submitted.length < a.assignedStudents.length
  );

  const pendingAssignmentsWithMissingStudents = pendingAssignments.map(
    (assignment: any) => {
      const submittedEmails = assignment.submitted.map((s: any) => s.student);
      const missingStudents = assignment.assignedStudents.filter(
        (email: string) => !submittedEmails.includes(email)
      );

      return {
        ...assignment,
        missingStudents,
      };
    }
  );

  const nonGradedAssignments = assignments.filter((a: any) =>
    a.submitted.some((s: any) => s.grade == null)
  );

  const gradedAssignments = assignments.filter((a: any) =>
    a.submitted.some((s: any) => s.grade != null)
  );

  const pages = [
    `Email: ${teacher?.email}`,
    `Name: ${teacher?.name}`,
    `Subject: ${teacher?.subject}`,
  ];

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
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Total Assignments</strong>
              </TableCell>
              <TableCell>
                <strong>Submitted</strong>
              </TableCell>
              <TableCell>
                <strong>Graded</strong>
              </TableCell>
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
                a.submitted?.some(
                  (s: any) => s.student === email && s.grade != null
                )
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
    <div  className={mode == "light" ? styles.container : styles.container_dark}>
      <div>
        <HeaderBar
          title="Teacher Dashboard"
          teacher={teacher}
          action={action}
          pending={pending}
          student={null}
        />

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
            <Container>
              <Button variant={mode =="light" ? "outlined" : "contained"} sx={{ mt: 2, background: "white" }}>
                <Link href="/dashboard/addAssignment">Add Assignment</Link>
              </Button>

              <StudentAnalyticsTable
                students={studentData}
                assignments={assignments}
              />
            </Container>
          )}

          {tabIndex === 1 && (
            <TeacherAssignmentList
              assignments={pendingAssignmentsWithMissingStudents}
              rateAction={handleRatingSubmit}
              students={studentData}
              showMissingStudents={true}
            />
          )}

          {tabIndex === 2 && (
            <TeacherAssignmentList
              assignments={nonGradedAssignments}
              rateAction={handleRatingSubmit}
              students={studentData}
            />
          )}

          {tabIndex === 3 && (
            <TeacherAssignmentList
              assignments={gradedAssignments}
              rateAction={handleRatingSubmit}
              students={studentData}
            />
          )}
        </Box>
      </div>
    </div>
  );
}

// function ResponsiveAppBar() {
//   return (
//     <AppBar position="static">
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>
//           <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
//           <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
//             {pages.map((page) => (
//               <Button
//                 key={page}
//                 sx={{ my: 2, color: "white", display: "block" }}
//               >
//                 {page}
//               </Button>
//             ))}
//           </Box>
//           <Box sx={{ flexGrow: 0 }}>
//             <form action={action}>
//               <Button
//                 startIcon={<Logout />}
//                 sx={{ my: 2, color: "white" }}
//                 type="submit"
//                 disabled={pending}
//               >
//                 Logout
//               </Button>
//             </form>
//           </Box>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }Ō
