'use client';

import { signup } from "@/app/actions/auth";
import {
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  Link,
  Select,
  MenuItem,
  
} from "@mui/material";
import { Logout, Visibility, VisibilityOff } from "@mui/icons-material";
import { useActionState, useEffect, useState } from "react";
import styles from "./signup.module.css";
import { FormErrors, SingupFormState, Student } from "../lib/types";
import { useRouter } from "next/navigation";
import { addStudent, addTeacher, isUserRegistered, useDB } from "../lib/utils";
import { useThemeContext } from "../ThemeContext";
import { useTheme } from "@mui/material/styles";

export default function SignupForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState<SingupFormState, FormData>(
    signup,
    undefined
  );

  const [localErrors, setLocalErrors] = useState<FormErrors>({});
  const [role, setRole] = useState<"teacher" | "student">("student");
  const [subject, setSubject] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mode } = useThemeContext();
  const theme = useTheme();

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
      const data = JSON.stringify(state?.userData?.data);
      console.log(data);
    }
  }, [state, router]);

  async function handleSubmit() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    if (role === "teacher") {
      formData.append("subject", subject);
    }
    if (profileImage) {
      const imageBlob = new Blob([profileImage], { type: profileImage.type });
  formData.append("profileImage", imageBlob);
}


    const alreadyRegistered = await isUserRegistered(email, role);

    if (alreadyRegistered) {
      setLocalErrors({ email: ["Email already registered!!"] });
      return;
    }

    const userData: any = {
      name,
      email,
      password,
      role,
      profileImage
    };

    if (role === "teacher") {
      userData.subject = subject;
      addTeacher(userData);
      localStorage.setItem("Current", JSON.stringify({ email: userData.email, role: userData.role }));
    } else {
      let student:Student = {
        email:userData.email,
        data:{
          name:userData.name,
          email:userData.email,
          password:userData.password,
          role:userData.role,
          profileImage:userData.profileImage
        },
        assignments:[]
      }
      addStudent(student);
      localStorage.setItem("Current", JSON.stringify({ email: userData.email, role: userData.role }));
    }

    const result = await signup(undefined, formData);

    if (result?.success) {
      router.push("/dashboard");
    } else {
      setLocalErrors(result.errors || {});
    }
  }

  return (
    <div className={mode === "light" ? styles.container : styles.container_dark}>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 500,
          margin: 'auto',
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h5" textAlign="center">Signup Form</Typography>

            <TextField
              label="Name"
              name="name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!state?.errors?.name}
              helperText={state?.errors?.name}
              fullWidth
            />

            <TextField
              label="Email"
              name="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!(state?.errors?.email || localErrors?.email)}
              helperText={state?.errors?.email || localErrors?.email?.[0]}
              fullWidth
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!state?.errors?.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            {state?.errors?.password && (
              <FormHelperText error>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {state.errors.password.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </FormHelperText>
            )}
            <TextField
  type="file"
  inputProps={{ accept: "image/*" }}
  onChange={(e) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  }}
  fullWidth
  label="Upload Profile Image"
  variant="outlined"
/>

{profileImage && (
  <img
    src={URL.createObjectURL(profileImage)}
    alt="Preview"
    style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
  />
)}


            <Select
              value={role}
              onChange={(_, newRole: any) => setRole(newRole)}
              name="role"
              variant="outlined"
            >
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </Select>

            {role === "teacher" && (
              <Select
                value={subject}
                onChange={(_, newSub: any) => setSubject(newSub)}
                name="subject"
                variant="outlined"
              >
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="Social">Social</MenuItem>
                <MenuItem value="Maths">Maths</MenuItem>
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Tamil">Tamil</MenuItem>
              </Select>
            )}

            <Button
              startIcon={<Logout />}
              variant="contained"
              disabled={pending}
              type="submit"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
              }}
            >
              Sign Up
            </Button>

            <Link href="/">
              Already registered? Login
            </Link>
          </Stack>
        </form>
      </Paper>
    </div>
  );
}
