"use client";

import { signup } from "@/app/actions/auth";
import { Button, Input, TextField, Typography } from "@mui/material";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { useActionState, useEffect, useState } from "react";
import styles from "./signup.module.css";
import { Logout } from "@mui/icons-material";
import { FormErrors, FormState, SingupFormState } from "../lib/types";
import { useRouter } from "next/navigation";
import { addStudent, addTeacher, isUserRegistered, useDB } from "../lib/utils";

export default function SignupForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState<SingupFormState, FormData>(
    signup,
    undefined
  );
  
const [localErrors, setLocalErrors] = useState<FormErrors>({});
const [success, setSuccess] = useState<boolean>(false);

  const [role, setRole] = useState<"teacher" | "student">("student");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    useDB();
  }, []);

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
      const data = JSON.stringify(state?.userData?.data);
      console.log(data);
    }
  }, [state, router]);

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string;
    const role = formData.get("role") as "teacher" | "student";

    const alreadyRegistered = await isUserRegistered(email , role);

    if (alreadyRegistered) {
      // Update local error state
      setLocalErrors({ email: ["Email already registered!!"] });
      return;
    }

    // Prepare user data
    const userData: any = {
      name: formData.get("name"),
      email,
      password: formData.get("password"),
      role,
    };

    if (role === "teacher") {
      userData.subject = formData.get("subject");
      addTeacher(userData);
      localStorage.setItem("Current", JSON.stringify({email:userData.email , role:userData.role}))
    }else{
      addStudent(userData);
    }

    // Call server-side signup to create session
    const result = await signup(undefined, formData);

    if (result?.success) {
      router.push("/dashboard");
    } else {
      setLocalErrors(result.errors || {});
    }
  }

  function handleRoleChange(event: any, newRole: any) {
    if (newRole == "teacher") {
      setRole("teacher");
    } else {
      setRole("student");
    }
  }

  function handleSubjectChange(event: any, newSub: any) {
    setSubject(newSub);
  }
  return (
    <div className={styles.container}>
      <form action={handleSubmit} className={styles.container}>
        <Typography variant="h5" textAlign={"center"}>
          Signup Form
        </Typography>
        <div className={styles.inputDiv}>
          <label htmlFor="name">Name:</label>
          <TextField
            id="name"
            name="name"
            placeholder="Name"
            variant="outlined"
          />
        </div>
        {state?.errors?.name && <p>{state.errors.name}</p>}

        <div className={styles.inputDiv}>
          <label htmlFor="email">Email:</label>
          <TextField
            id="email"
            name="email"
            placeholder="email@gmail.com"
            variant="outlined"
          />
        </div>
        
        {(state?.errors?.email || localErrors?.email) && (
          <p>{(state?.errors?.email || localErrors?.email)??[][0] }</p>
        )}


        <div className={styles.inputDiv}>
          <label htmlFor="password">Password:</label>
          <TextField
            id="password"
            name="password"
            type="password"
            variant="outlined"
          />
        </div>
        {state?.errors?.password && (
          <div>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className={styles.inputDiv}>
          <label htmlFor="role">Role</label>
          <Select
            onChange={handleRoleChange}
            value={role}
            id="role"
            name="role"
            disabled={false}
            variant="outlined"
          >
            <Option value={"teacher"}>Teacher</Option>
            <Option value={"student"}>Student</Option>
          </Select>
        </div>

        {role == "teacher" ? (
          <div className={styles.inputDiv}>
            <label htmlFor="role">Subject</label>
            <Select
              onChange={handleSubjectChange}
              value={subject}
              id="subject"
              name="subject"
              disabled={false}
              variant="outlined"
            >
              <Option value={"Science"}>Science</Option>
              <Option value={"Social"}>Social</Option>
              <Option value={"Maths"}>Maths</Option>
              <Option value={"English"}>English</Option>
              <Option value={"Tamil"}>Tamil</Option>
            </Select>
          </div>
        ) : null}

        <Button
          startIcon={<Logout />}
          variant="contained"
          disabled={pending}
          type="submit"
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
}
