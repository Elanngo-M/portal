"use client";

import { Logout1 } from "@/app/actions/auth";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
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
  const [assignmentNameFilter, setAssignmentNameFilter] = useState("");
const [studentNameFilter, setStudentNameFilter] = useState("");
const [dueOrder, setDueOrder] = useState("asc");


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
  useEffect(() => {
  const storedAssignmentName = localStorage.getItem("assignmentNameFilter") || "";
  const storedStudentName = localStorage.getItem("studentNameFilter") || "";
  const storedDueOrder = localStorage.getItem("dueOrder") || "asc";

  setAssignmentNameFilter(storedAssignmentName);
  setStudentNameFilter(storedStudentName);
  setDueOrder(storedDueOrder);
}, []);


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

  const getStudentName = (email: string): string => {
  const student = studentData.find((s) => s.email === email);
  return student?.data?.name || "Unknown Student";
};


const filteredAssignments = assignments
  .filter((a) =>
    a.name.toLowerCase().includes(assignmentNameFilter.toLowerCase())
  )
  .map((a) => {
    const submittedStudents = a.submitted.map((s: any) => ({
      ...s,
      name: getStudentName(s.student),
    }));

    const submittedEmails = submittedStudents.map((s) => s.student);

    // Filter submitted students by name
    const filteredSubmittedStudents = submittedStudents.filter((s) =>
      s.name.toLowerCase().includes(studentNameFilter.toLowerCase())
    );

    // Filter assigned students by name
    const filteredAssignedStudents = a.assignedStudents.map((email: string) => ({
      email,
      name: getStudentName(email),
    }));

    // Filter missing students from assigned list
    const filteredMissingStudents = filteredAssignedStudents
      .filter((s) => !submittedEmails.includes(s.email))
      .filter((s) =>
        s.name.toLowerCase().includes(studentNameFilter.toLowerCase())
      );

    // Only include this assignment if there's at least one matching student
    const hasMatchingStudent =
      filteredSubmittedStudents.length > 0 || filteredMissingStudents.length > 0;

    if (!hasMatchingStudent) return null;

    return {
      ...a,
      filteredSubmittedStudents,
      filteredMissingStudents,
    };
  })
  .filter(Boolean); // Remove nulls


  const pendingAssignments = filteredAssignments.filter(
  (a: any) => a.filteredMissingStudents.length > 0
);



const pendingAssignmentsWithMissingStudents = pendingAssignments.map((assignment: any) => ({
  ...assignment,
  missingStudents: assignment.filteredMissingStudents,
}));



  const nonGradedAssignments = filteredAssignments.filter((a: any) =>
  a.filteredSubmittedStudents.some((s: any) => s.grade == null)
);

const gradedAssignments = filteredAssignments
  .map((a: any) => {
    const gradedFilteredStudents = a.filteredSubmittedStudents.filter(
      (s: any) => s.grade != null
    );

    if (gradedFilteredStudents.length === 0) return null;

    return {
      ...a,
      filteredSubmittedStudents: gradedFilteredStudents,
    };
  })
  .filter(Boolean);



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

        <Container>
          
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
          {tabIndex !=0 ? <Box sx={{ display: "flex", gap: 2, my: 2 }}>
  <TextField
    label="Assignment Name"
    variant="outlined"
    value={assignmentNameFilter}
    onChange={(e) => setAssignmentNameFilter(e.target.value)}
  />
  <TextField
  label="Student Name"
  variant="outlined"
  value={studentNameFilter}
  onChange={(e) => {
    const value = e.target.value;
    console.log("Student Name Filter Changed:", value); 
    setStudentNameFilter(value);
    localStorage.setItem("studentNameFilter", value); 
  }}
/>

</Box> : null}

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
        
        </Container>
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
