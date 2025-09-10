"use client";

import { Logout1 } from "@/app/actions/auth";
import { RootState } from "@/redux_files/state/store";
import {
  CheckBoxOutlineBlank,
  CheckBoxOutlineBlankOutlined,
  CheckBoxOutlined,
  Logout,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserLocalData,
  setAllStudentReduxData,
  setTeacherReduxData,
} from "@/app/lib/utils";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { AddAssingmenttoStudent } from "@/app/actions/assignment";
import {
  Autocomplete,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Input,
  Paper,
  TextField,
} from "@mui/material";

export default function AddAssignment() {
  const Allstudent = useSelector(
    (selector: RootState) => selector.AllStudentData
  );

  const teacher = useSelector((selector: RootState) => selector.TeacherData);
  const router = useRouter();
  const dispatch = useDispatch();

  const [state, action, pending] = useActionState(Logout1, undefined);
  const [astate, aaction, a_pending] = useActionState(
    AddAssingmenttoStudent,
    undefined
  );
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

  const handleSubmit = (formData: FormData) => {
    formData.set("students", JSON.stringify(columns));
    return aaction(formData);
  };

  const allOptions = (Allstudent.students || []).map((student: any) => student.email);
  const [columns, setColumns] = React.useState<any[]>([]);
  const [selectAll, setSelectAll] = React.useState<boolean>(false);
  const today = new Date().toISOString().slice(0, 10);

  const handleToggleSelectAll = () => {
    setSelectAll((prev) => {
      if (!prev) setColumns([...allOptions]);
      else setColumns([]);
      return !prev;
    });
  };
  useEffect(() => {
    if (astate?.success) {
      router.push("/dashboard");
    }
  }, [router, astate])
  return (
    <div>
      <ResponsiveAppBar />
      <form action={handleSubmit} style={{ marginTop: 24, maxWidth: 500 , display:'flex' , flexDirection:'column'}}>
        <TextField
          name="name"
          label="Assignment Name"
          fullWidth
          margin="normal"
          required
        />
        <Autocomplete
          multiple
          id="students-checkboxes"
          disableCloseOnSelect
          filterSelectedOptions
          freeSolo={false}
          options={allOptions}
          value={columns}
          onChange={(_e, value, reason) => {
        if (reason === "clear" || reason === "removeOption")
          setSelectAll(false);
        if (reason === "selectOption" && value.length === allOptions.length)
          setSelectAll(true);
        setColumns(value);
      }}
          getOptionLabel={(option) => `${option}`}
          renderOption={(props, option, { selected }) => {
            const { key, ...otherProps } = props;
            return (
              <li key={option} {...otherProps}>
                <Checkbox
                  icon={<CheckBoxOutlineBlankOutlined fontSize="small" />}
                  checkedIcon={<CheckBoxOutlineBlank fontSize="small" />}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Students"
              placeholder="Students"
            />
          )}
          PaperComponent={(paperProps) => {
        const { children, ...restPaperProps } = paperProps;
        return (
          <Paper {...restPaperProps}>
            <Box
              onMouseDown={(e) => e.preventDefault()} // prevent blur
              pl={1.5}
              py={0.5}
            >
              <FormControlLabel
                onClick={(e) => {
                  e.preventDefault(); // prevent blur
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
          <Input name="dueDate" type="date"/>
        </label>
        <label>
          Minimum word count:
          <Input name="minCount" type="number"/>
        </label>
        <input name="subject" value={teacher.subject ?? ""} type="text" readOnly hidden />
        <input name="assignedDate" value={today} type="text" readOnly hidden />
        <input name="teacher" value={teacher.email ?? ""} type="text" readOnly hidden />
        <Button
          type="submit"
          variant="contained"
          disabled={a_pending || columns.length === 0}
          sx={{ mt: 2 }}
        >
          Add Assignment
        </Button>
      </form>
    </div>
  );
}
