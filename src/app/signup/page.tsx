'use client'
 
import { signup } from '@/app/actions/auth'
import { Button, Input, TextField, Typography } from '@mui/material';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import { useActionState, useEffect, useState } from 'react'
import styles from './signup.module.css'
import { Logout } from '@mui/icons-material';
import { FormState, SingupFormState } from '../lib/types';
import { useRouter } from 'next/navigation';
 
export default function SignupForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState<SingupFormState , FormData>(signup, undefined);
  const [role , setRole] = useState<"teacher" | "student">("student");
  const [subject , setSubject] =  useState("");

  useEffect(()=>{
    if(state?.success){
      router.push("/dashboard");
      const data = JSON.stringify(state?.userData?.data)
      localStorage.setItem("UserData",data);
      localStorage.setItem("loggedIn:","true");
    }
  },[state , router])

  function handleRoleChange(event:any , newRole:any){
    if(newRole == "teacher"){
      setRole("teacher");
    }else{
      setRole("student");
    }
  }

  function handleSubjectChange(event:any , newSub:any){
    setSubject(newSub);
  }
  return (
    <div className={styles.container}>
    <form action={action} className={styles.container}>
      <Typography variant='h5' textAlign={'center'}>Signup Form</Typography>
      <div className={styles.inputDiv}>
        <label htmlFor="name">Name:</label>
        <TextField id='name' name='name' placeholder='Name' variant='outlined' />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}
 
      <div className={styles.inputDiv}>
        <label htmlFor="email">Email:</label>
        <TextField id="email" name="email" placeholder="email@gmail.com" variant='outlined' />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}
 
      <div className={styles.inputDiv}>
        <label htmlFor="password">Password:</label>
        <TextField id="password" name="password" type="password" variant='outlined' />
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
      <Select onChange={handleRoleChange} value={role} id="role" name="role"
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
      <Select onChange={handleSubjectChange} value={subject} id="subject" name="subject"
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

      <Button startIcon={<Logout/>}  variant='contained' disabled={pending} type="submit">
        Sign Up
      </Button>
    </form>
    </div>
  )
}