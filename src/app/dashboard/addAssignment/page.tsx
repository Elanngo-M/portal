"use client";

import { AddAssingmenttoStudent } from "@/app/actions/assignment";
import { Logout1 } from "@/app/actions/auth";
import { assignment, Student, Teacher } from "@/app/lib/types";
import {
  getAllStudent,
  getAssignment,
  getTeacher,
  writeAssignmentIDB,
} from "@/app/lib/utils";
import { useThemeContext } from "@/app/ThemeContext";
import {
  CheckBoxOutlineBlank,
  CheckBoxOutlineBlankOutlined,
} from "@mui/icons-material";
import {
  Alert,
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
  Typography,
  useTheme,
} from "@mui/material";

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
  const [minCount, setMinCount] = React.useState<string>("0");
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

  const isDueDateValid =
  dueDate &&
  new Date(dueDate).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);
  const isMinCountValid = Number(minCount) > 0;
  console.log(isDueDateValid);
  const isFormValid =
    !nameError && isDueDateValid && isMinCountValid && columns.length > 0;

  const handleSubmit = async (event: any, formData: FormData) => {
    event.preventDefault();

    const studentsString = JSON.stringify(columns);
    const subject = formData.get("subject");
    const teacher = formData.get("teacher");
    const dueDate = formData.get("dueDate");
    let minC = formData.get("minCount");
    let minCo = minC?.toString();
    let minCount:number = Number(minCo);

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
      setMinCount("0");

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

  const theme = useTheme();
  const { mode }= useThemeContext()

  return (
    <div>
  
      <Button
  variant="text"
  href="/dashboard"
  sx={[{
    alignSelf: "flex-start",
    m: 2}, mode=="light" ? {color:"black"} : {color:"white"}]}
>Dashboard</Button>
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: theme.palette.background.paper,
        }}
      >
        

        <Typography variant="h5" gutterBottom align="center">
          Assignment Adder
        </Typography>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            handleSubmit(event, formData);
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
                (a) =>
                  a.name?.trim().toLowerCase() === value.trim().toLowerCase()
              );
              setNameError(exists ? "Assignment name already exists" : null);
            }}
          />

          <Autocomplete
            multiple
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
            isOptionEqualToValue={(option, value) =>
              option.email === value.email
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Students"
                placeholder="Students"
                margin="normal"
              />
            )}
            renderOption={(props, option, { selected }) => {
              const { key, ...rest } = props;
              return (
                <li key={key} {...rest}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankOutlined fontSize="small" />}
                    checkedIcon={<CheckBoxOutlineBlank fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.name} ({option.email})
                </li>
              );
            }}
            PaperComponent={(paperProps) => {
              const { children, ...rest } = paperProps;
              return (
                <Paper {...rest}>
                  <Box
                    onMouseDown={(e) => e.preventDefault()}
                    pl={1.5}
                    py={0.5}
                  >
                    <FormControlLabel
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleSelectAll();
                      }}
                      label="Select all"
                      control={
                        <Checkbox
                          id="select-all-checkbox"
                          checked={selectAll}
                        />
                      }
                    />
                  </Box>
                  <Divider />
                  {children}
                </Paper>
              );
            }}
          />

<TextField
  label="Due Date"
  type="date"
  name="dueDate"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
  fullWidth
  margin="normal"
  required
  InputLabelProps={{ shrink: true }}
  sx={mode=="dark"?{
    '& input': {
      backgroundColor: 'transparent',
      color: 'inherit',
    },
    '& input::-webkit-calendar-picker-indicator': {
      filter: 'invert(1)', // Inverts the icon color for dark mode
    },
    '& input:-webkit-autofill': {
      boxShadow: '0 0 0 1000px #f5f5f5 inset',
      WebkitTextFillColor: '#000',
    },
  }:{
    '& input': {
      backgroundColor: 'transparent',
      color: 'inherit',
    },
    '& input:-webkit-autofill': {
      boxShadow: '0 0 0 1000px #f5f5f5 inset',
      WebkitTextFillColor: '#000',
    },
  }}
/>






          <Input
  name="minCount"
  type="number"
  fullWidth
  required
  value={minCount}
  onChange={(e) => {
    const value = e.target.value;
    const numericValue = parseInt(value, 10);
    setMinCount(numericValue.toString());
  }}
  inputProps={{
    inputMode: 'numeric',
    pattern: '[0-9]*',
    min: 1,
  }}
  sx={{
    '& input': {
      fontVariantNumeric: 'normal',
    },
    '& input:-webkit-autofill': {
      boxShadow: '0 0 0 1000px #f5f5f5 inset',
      WebkitTextFillColor: '#000',
    },
  }}
/>


          {/* Hidden Inputs */}
          <input
            name="subject"
            value={teacher?.subject ?? ""}
            type="hidden"
            readOnly
          />
          <input name="assignedDate" value={today} type="hidden" readOnly />
          <input
            name="teacher"
            value={teacher?.email ?? ""}
            type="hidden"
            readOnly
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
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
      </Box>
    </Container>
        
    </div>
  );
}
