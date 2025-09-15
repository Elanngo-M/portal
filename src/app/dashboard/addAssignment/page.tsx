"use client";

import { AddAssingmenttoStudent } from "@/app/actions/assignment";
import { Logout1 } from "@/app/actions/auth";
import { assignment, Student, Teacher } from "@/app/lib/types";
import {
  getAllStudent,
  getAssignment,
  getTeacher,
  writeAssignmentIDB
} from "@/app/lib/utils";
import {
  CheckBoxOutlineBlank,
  CheckBoxOutlineBlankOutlined,
  Logout,
} from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Input,
  Paper,
  Snackbar,
  TextField,
  Toolbar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useActionState, useEffect } from "react";

export default function AddAssignment() {
  const [studentData, setStudentData] = React.useState<Student[]>([]);
  const [teacher, setTeacher] = React.useState<Teacher | null>(null);
  const router = useRouter();

  const [state, action, pending] = useActionState(Logout1, undefined);
  const [astate, aaction, a_pending] = useActionState(
    AddAssingmenttoStudent,
    undefined
  );

  const [columns, setColumns] = React.useState<string[]>([]);
  const [selectAll, setSelectAll] = React.useState<boolean>(false);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [dueDate, setDueDate] = React.useState<string>("");
  const [minCount, setMinCount] = React.useState<number>(0);
  const [assignments, setAssignments] = React.useState<assignment[]>([]);
  const [assignmentName, setAssignmentName] = React.useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);



  const allOptions = (studentData || []).map((student: any) => ({
    email: student.email,
    name: student.data.name,
  }));

  const today = new Date().toISOString().slice(0, 10);

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
      localStorage.removeItem("UserData");
      router.push("/login");
    }
  }, [state, router]);

  useEffect(() => {
    if (astate?.success) {
      router.push("/dashboard");
    }
  }, [router, astate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();
    const exists = assignments.some(
      (a: any) => a.name?.trim().toLowerCase() === value
    );
    setNameError(exists ? "Assignment name already exists" : null);
  };

  const handleToggleSelectAll = () => {
    setSelectAll((prev) => {
      if (!prev) {
        const allEmails = allOptions.map((s) => s.email);
        setColumns(allEmails);
      } else setColumns([]);
      return !prev;
    });
  };

  const isDueDateValid = dueDate && new Date(dueDate) > new Date();
  const isMinCountValid = typeof minCount === "number" && minCount > 0;
  const isFormValid =
    !nameError && isDueDateValid && isMinCountValid && columns.length > 0;

  const handleSubmit = async (event: any, formData: FormData) => {
  event.preventDefault();

  const studentsString = JSON.stringify(columns);
  const subject = formData.get("subject");
  const teacher = formData.get("teacher");
  const dueDate = formData.get("dueDate");
  const minCount = formData.get("minCount");

  try {
    const selectedStudents = JSON.parse(studentsString as string);

    const assignment: assignment = {
      name: assignmentName,
      assignedStudents: selectedStudents.map((student: Student) => student),
      subject: subject,
      teacher: teacher,
      dueDate: dueDate,
      minCount: minCount,
      submitted: [],
    };

    console.log("Processing assignment:", assignment);
    await writeAssignmentIDB(assignment);

    let current: any = localStorage.getItem("Current");
    current = JSON.parse(current);
    const ass = (await getAssignment(current.email, "teacher")) ?? [];
    setAssignments(ass);

    // ✅ Clear form
    setAssignmentName("");
    setColumns([]);
    setSelectAll(false);
    setNameError(null);
    setDueDate("");
    setMinCount(0);

    // ✅ Show success snackbar
    setSnackbarOpen(true);

    return {
      success: true,
      message: `Assignment created for ${selectedStudents.length} students`,
    };
  } catch (error) {
    console.error("Error processing assignment:", error);
    return {
      error: "Failed to create assignment",
      details: error instanceof Error ? error.message : String(error),
    };
  }
};


  return (
    <div>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {[
                `Email: ${teacher?.email}`,
                `Name: ${teacher?.name}`,
                `Subject: ${teacher?.subject}`,
              ].map((page) => (
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

      <form  
      onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          handleSubmit(event, formData);
        }}

        style={{
          marginTop: 24,
          maxWidth: 500,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
  name="name"
  label="Assignment Name"
  fullWidth
  margin="normal"
  required
  error={!!nameError}
  helperText={nameError}
  value={assignmentName}
  onChange={(e) => {
    const value = e.target.value;
    setAssignmentName(value);
    const exists = assignments.some(
      (a: any) => a.name?.trim().toLowerCase() === value.trim().toLowerCase()
    );
    setNameError(exists ? "Assignment name already exists" : null);
  }}
/>


        <Autocomplete
          multiple
          id="students-checkboxes"
          disableCloseOnSelect
          filterSelectedOptions
          options={allOptions}
          value={allOptions.filter((opt) => columns.includes(opt.email))}
          onChange={(_e, selectedOptions, reason) => {
            const selectedEmails = selectedOptions.map((opt) => opt.email);
            setColumns(selectedEmails);

            if (reason === "clear" || reason === "removeOption")
              setSelectAll(false);
            if (
              reason === "selectOption" &&
              selectedEmails.length === allOptions.length
            )
              setSelectAll(true);
          }}
          getOptionLabel={(option) => `${option.name} (${option.email})`}
          isOptionEqualToValue={(option, value) => option.email === value.email}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Students"
              placeholder="Students"
            />
          )}
          renderOption={(props, option, { selected }) => {
            let {key , ...otherprops} = props;
            return(
            <li key={key} {...otherprops}>
              <Checkbox
                icon={<CheckBoxOutlineBlankOutlined fontSize="small" />}
                checkedIcon={<CheckBoxOutlineBlank fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.name} ({option.email})
            </li>
          )}}
          PaperComponent={(paperProps) => {
            const { children, ...restPaperProps } = paperProps;
            return (
              <Paper {...restPaperProps}>
                <Box onMouseDown={(e) => e.preventDefault()} pl={1.5} py={0.5}>
                  <FormControlLabel
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleSelectAll();
                    }}
                    label="Select all"
                    control={
                      <Checkbox id="select-all-checkbox" checked={selectAll} />
                    }
                  />
                </Box>
                <Divider />
                {children}
              </Paper>
            );
          }}
        />

        <label>
          Due date:
          <Input
            name="dueDate"
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>

        <label>
          Minimum word count:
          <Input
            name="minCount"
            type="number"
            required
            value={minCount ?? ""}
            onChange={(e) => setMinCount(Number(e.target.value))}
          />
        </label>

        <input
          name="subject"
          value={teacher?.subject ?? ""}
          type="text"
          readOnly
          hidden
        />
        <input name="assignedDate" value={today} type="text" readOnly hidden />
        <input
          name="teacher"
          value={teacher?.email ?? ""}
          type="text"
          readOnly
          hidden
        />

        <Button
          type="submit"
          variant="contained"
          disabled={a_pending || !isFormValid}
          sx={{ mt: 2 }}
        >
          Add Assignment
        </Button>
      </form>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
>
  <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
    Assignment submitted successfully!
  </Alert>
</Snackbar>

    </div>
  );
}
