import { Logout } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Logout1 } from "../actions/auth";
import AssignmentTabs from "../lib/components/assignmentTabs";
import { assignment, assignmentSubmit, Student } from "../lib/types";
import {
  getAssignment,
  getStudent,
  SubmitAssignmentAnswer
} from "../lib/utils";
import HeaderBar from "../lib/components/HeaderBar";

export default function Studentboard() {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  const [tabIndex, setTabIndex] = useState(
    Number(localStorage.getItem("tabIndex")) || 0
  );

  const router = useRouter();
  const [state, action, pending] = useActionState(Logout1, undefined);
  const [loadingTabs, setLoadingTabs] = useState(false);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [assignments, setAssignments] = useState<assignment[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let current: any = localStorage.getItem("Current");
      current = JSON.parse(current);
      const stu = await getStudent(current.email);
      const ass = (await getAssignment(current.email, "student")) ?? [];
      setStudentData(stu);
      setAssignments(ass);
      setLoading(false);
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   setStudentReduxData(dispatch);
  // }, []);

  useEffect(() => {
    if (state?.success) {
      localStorage.removeItem("Current");
      router.push("/");
    }
  }, [state, router]);

  function submitAss(
    name: string,
    subject: string,
    teacher: string,
    minCount: number,
    setLocalAlert?: (
      alert: { type: "success" | "error" | "warning"; message: string } | null
    ) => void
  ) {
    const answer = answers[name] || "";
    const wordCount = answer.trim().split(/\s+/).length;

    if (wordCount < minCount) {
      setLocalAlert?.({
        type: "warning",
        message: `Minimum ${minCount} words required in the answer. You wrote ${wordCount}.`,
      });
      return;
    }

    setLocalAlert?.(null);

    const today = new Date().toISOString().split("T")[0];
    const payload: assignmentSubmit = {
      name,
      studentName: studentData?.email,
      subject,
      teacher,
      date: today,
      answer,
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) =>
      formData.append(key, value)
    );

    SubmitAssignmentAnswer({}, formData).then((res) => {
      if (res?.success) {
        getAssignment(studentData?.email, "student").then((res) => {
          setAssignments(res);
        });
        setLocalAlert?.({
          type: "success",
          message: "Assignment submitted successfully!",
        });
      } else {
        setLocalAlert?.({
          type: "error",
          message: "Submission failed. Please try again.",
        });
      }
    });
  }

  const [subjectFilter, setSubjectFilter] = useState(() => {
    return localStorage.getItem("subjectFilter") || "All";
  });

  const [dueOrder, setDueOrder] = useState(() => {
    return localStorage.getItem("dueOrder") || "asc";
  });

  const handleSubjectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string;
    setSubjectFilter(value);
    localStorage.setItem("subjectFilter", value);
  };

  const handleDueOrderChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string;
    setDueOrder(value);
    localStorage.setItem("dueOrder", value);
  };
  const handleTabIndexChange = (value: number) => {
    setLoadingTabs(true);
    setTabIndex(value);
    localStorage.setItem("tabIndex", value.toString());

    setTimeout(() => {
      setLoadingTabs(false);
    }, Math.random() * 5 * 100);
  };

  const subjects = Array.from(new Set(assignments.map((a) => a.subject)));
  const filteredAssignments = assignments
    .filter((a) => subjectFilter === "All" || a.subject === subjectFilter)
    .sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dueOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const pendingAssignments = filteredAssignments.filter(
    (a) => !a.submitted?.some((s) => s.student === studentData?.email)
  );

  const gradedAssignments = filteredAssignments.filter((a) => {
    const submission = a.submitted?.find(
      (s) => s.student === studentData?.email
    );
    return submission && submission.grade != null;
  });

  const submittedAssignments = filteredAssignments.filter((a) => {
    const submission = a.submitted?.find(
      (s) => s.student === studentData?.email
    );
    return submission && submission.grade == null;
  });

  return (
    <div>
      <HeaderBar
  title="Student Dashboard"
  action={action}
  pending={pending}
  student={studentData}
/>


      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Subject</InputLabel>
          <Select
            value={subjectFilter}
            label="Subject"
            onChange={(e: any) => {
              handleSubjectChange(e);
            }}
          >
            <MenuItem value="All">All</MenuItem>
            {subjects.map((subj) => (
              <MenuItem key={subj} value={subj}>
                {subj}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Due Date</InputLabel>

          <Select
            value={dueOrder}
            label="Due Date"
            onChange={(e: any) => {
              handleDueOrderChange(e);
            }}
          >
            <MenuItem value="asc">Earliest First</MenuItem>
            <MenuItem value="desc">Latest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tabs */}

      <Box sx={{ mt: 4 }}>
        {loadingTabs ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <AssignmentTabs
            setAlert={setAlert}
            alert={alert}
            tabIndex={tabIndex}
            setTabIndex={handleTabIndexChange}
            pendingAssignments={pendingAssignments}
            submittedAssignments={submittedAssignments}
            gradedAssignments={gradedAssignments}
            studentEmail={studentData?.email}
            answers={answers}
            setAnswers={setAnswers}
            onSubmit={submitAss}
          />
        )}
      </Box>
    </div>
  );
}
