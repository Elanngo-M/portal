import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Rating,
  Stack,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, useEffect, useActionState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux_files/state/store";
import { SubmitAssignmentAnswer } from "../actions/assignment";
import { assignment, assignmentSubmit } from "../lib/types";
import { setStudentReduxData, submitAsstoRedux } from "../lib/utils";
import { Logout1 } from "../actions/auth";
import { useRouter } from "next/navigation";
import { Logout } from "@mui/icons-material";
import AssignmentTabs from "../lib/components/assignmentTabs";

export default function Studentboard() {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [tabIndex, setTabIndex] = useState(0);
  const student = useSelector((state: RootState) => state.StudentData);
  const dispatch = useDispatch();
  const router = useRouter();
   const [state, action, pending] = useActionState(Logout1, undefined);

  useEffect(() => {
    setStudentReduxData(dispatch);
  }, []);
  

  useEffect(() => {
    if (state?.success) {
      localStorage.removeItem("UserData");
      router.push("/login");
    }
  }, [state, router]);

  function submitAss(name: string, subject: string, teacher: string, minCount: number) {
    const answer = answers[name] || "";
    const wordCount = answer.trim().split(/\s+/).length;

    if (wordCount < minCount) {
      alert(`Minimum ${minCount} words required. You wrote ${wordCount}.`);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const payload: assignmentSubmit = {
      name,
      studentName: student.data.email,
      subject,
      teacher,
      date: today,
      answer,
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

    SubmitAssignmentAnswer({}, formData).then((res) => {
      if (res?.success) {
        submitAsstoRedux(dispatch, payload);
      }
    });
  }


const [subjectFilter, setSubjectFilter] = useState("All");
const [dueOrder, setDueOrder] = useState("asc");

const subjects = Array.from(new Set(student.assignments.map(a => a.subject)));
const filteredAssignments = student.assignments
  .filter((a) => subjectFilter === "All" || a.subject === subjectFilter)
  .sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return dueOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

const pendingAssignments = filteredAssignments.filter(
  (a) => !a.submitted?.some((s) => s.student === student.data.email)
);

const gradedAssignments = filteredAssignments.filter((a) => {
  const submission = a.submitted?.find((s) => s.student === student.data.email);
  return submission && submission.grade != null;
});

const submittedAssignments = filteredAssignments.filter((a) => {
  const submission = a.submitted?.find((s) => s.student === student.data.email);
  return submission && submission.grade == null;
});


  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Student Dashboard
          </Typography>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2">Email: {student.data.email}</Typography>
            <Typography variant="body2">Name: {student.data.name}</Typography>
          </Box>
            <form action={action} style={{marginLeft:'10px'}}>
                <Button
                  startIcon={<Logout/>}
                  sx={{ my: 2, color: "white" }}
                  type="submit"
                  disabled={pending}
                >
                  Logout
                </Button>
              </form>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
  <FormControl sx={{ minWidth: 150 }}>
    <InputLabel>Subject</InputLabel>
    <Select
      value={subjectFilter}
      label="Subject"
      onChange={(e) => setSubjectFilter(e.target.value)}
    >
      <MenuItem value="All">All</MenuItem>
      {subjects.map((subj) => (
        <MenuItem key={subj} value={subj}>{subj}</MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl sx={{ minWidth: 150 }}>
    <InputLabel>Due Date</InputLabel>
    <Select
      value={dueOrder}
      label="Due Date"
      onChange={(e) => setDueOrder(e.target.value)}
    >
      <MenuItem value="asc">Earliest First</MenuItem>
      <MenuItem value="desc">Latest First</MenuItem>
    </Select>
  </FormControl>
</Box>

      {/* Tabs */}
      
<Box sx={{ mt: 4 }}>
      <AssignmentTabs
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        pendingAssignments={pendingAssignments}
        submittedAssignments={submittedAssignments}
        gradedAssignments={gradedAssignments}
        studentEmail={student.data.email}
        answers={answers}
        setAnswers={setAnswers}
        onSubmit={submitAss}
      />
    </Box>

    </div>
  );
}
