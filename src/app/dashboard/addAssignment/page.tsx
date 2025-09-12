"use client";

import { AddAssingmenttoStudent } from "@/app/actions/assignment";
import { Logout1 } from "@/app/actions/auth";
import { setAllStudentReduxData, setTeacherReduxData } from "@/app/lib/utils";
import { RootState } from "@/redux_files/state/store";
import {
  CheckBoxOutlineBlank,
  CheckBoxOutlineBlankOutlined,
  Logout,
} from "@mui/icons-material";
import {
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
  TextField,
  Toolbar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useActionState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AddAssignment() {
  const Allstudent = useSelector((state: RootState) => state.AllStudentData);
  const teacher = useSelector((state: RootState) => state.TeacherData);
  const router = useRouter();
  const dispatch = useDispatch();

  const [state, action, pending] = useActionState(Logout1, undefined);
  const [astate, aaction, a_pending] = useActionState(
    AddAssingmenttoStudent,
    undefined
  );

  const [columns, setColumns] = React.useState<string[]>([]);
  const [selectAll, setSelectAll] = React.useState<boolean>(false);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [dueDate, setDueDate] = React.useState<string>("");
  const [minCount, setMinCount] = React.useState<number | null>(null);

  const allOptions = (Allstudent.students || []).map((student: any) => ({
    email: student.email,
    name: student.data.name,
  }));

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (state?.success) {
      localStorage.removeItem("UserData");
      router.push("/login");
    }
  }, [state, router]);

  useEffect(() => {
    setTeacherReduxData(dispatch);
    setAllStudentReduxData(dispatch);
  }, []);

  useEffect(() => {
    if (astate?.success) {
      router.push("/dashboard");
    }
  }, [router, astate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();
    const exists = Allstudent.assignments.some(
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

  const handleSubmit = async (formData: FormData) => {
    formData.set("students", JSON.stringify(columns));
    return await aaction(formData);
  };

  return (
    <div>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {[
                `Email: ${teacher.email}`,
                `Name: ${teacher.name}`,
                `Subject: ${teacher.subject}`,
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
        action={handleSubmit}
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
          onChange={handleNameChange}
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
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={<CheckBoxOutlineBlankOutlined fontSize="small" />}
                checkedIcon={<CheckBoxOutlineBlank fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.name} ({option.email})
            </li>
          )}
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
          value={teacher.subject ?? ""}
          type="text"
          readOnly
          hidden
        />
        <input name="assignedDate" value={today} type="text" readOnly hidden />
        <input
          name="teacher"
          value={teacher.email ?? ""}
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
    </div>
  );
}
