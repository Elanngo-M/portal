'use client'
 
import { Login, signup } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { use } from 'react'
import styles from './loginform.module.css';

import type { FormErrors, FormState } from '@/app/lib/types';
import { Button, Input, Stack, TextField, Typography } from '@mui/material'
import MailIcon from '@mui/icons-material/Mail';
import KeyIcon from '@mui/icons-material/Key';
import Link from 'next/link'
import { ExitToApp } from '@mui/icons-material'
import { isPassMatch, isUserRegistered, useDB } from '@/app/lib/utils'

export default function LoginForm({
  params,
}: {
  params: Promise<{ user_role: string }>
}) {
  const { user_role } = use(params);
  const router = useRouter();
  const [state, action, pending] = useActionState<FormState, FormData>(Login, undefined);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(user_role);
  const [localErrors, setLocalErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
      let data = null
      if(user_role == "teacher"){
         data = JSON.stringify(state?.userData?.data);
      }else{
        data = JSON.stringify(state?.userData);
      }
      localStorage.setItem("UserData",data);
      localStorage.setItem("loggedIn:","true");
    }
  }, [router, state])

   async function handleSubmit(formData: FormData) {
      const email = formData.get("email") as string;
      const role = formData.get("role") as "teacher" | "student";
  
      const alreadyRegistered = await isUserRegistered(email , role);
  
      if (!alreadyRegistered) {
        // Update local error state
        setLocalErrors({ email: ["Email not registered!!"] });
        return;
      }
  
      // Prepare user data
      const userData: any = {
        name: formData.get("name"),
        email,
        password: formData.get("password"),
        role,
      };
  
      const res = await isPassMatch(email , role , userData.password);
      if(res){
        const result = await Login(undefined, formData);
        if (result?.success) {
          localStorage.setItem("Current", JSON.stringify({email:userData.email , role:userData.role}))
          router.push("/dashboard");
        } else {
          setLocalErrors(result.errors || {});
        }
      }else{
       setLocalErrors({ email: ["Invalid credentials"] });
      }
  
  
    }

  return (
    <div className={styles.container}>
      <form className={styles.form} action={handleSubmit}>
        <Typography variant='h5' textAlign={'center'}>{user_role == "teacher" ? "Teacher" : "Student"} Login</Typography>
        <div style={{ display: 'table', width: '100%', marginBottom: 16 }}>
          <div style={{ display: 'table-row' }}>
        <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingRight: 8, textAlign: 'right', whiteSpace: 'nowrap' }}>
          <label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
            <MailIcon /> Email:
          </label>
        </div>
        <div style={{ display: 'table-cell', width: '100%' }}>
          <TextField
            onChange={e => setEmail(e.target.value)}
            id="email"
            value={email}
            name="email"
            placeholder="Email"
            variant="standard"
            fullWidth
          />
        </div>
          </div>
          {localErrors.email && (
            <div style={{ display: 'table-row' }}>
          <div style={{ display: 'table-cell' }}></div>
            <Typography color="error" variant="body2">{localErrors.email}</Typography>
          <div style={{ display: 'table-cell' }}>
          </div>
        </div>
          )}
          <div style={{ display: 'table-row', marginTop: 8 }}>
        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap', paddingRight: 8 }}>
          <label htmlFor="password" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
            <KeyIcon /> Password:
          </label>
        </div>
        <div style={{ display: 'table-cell', width: '100%' }}>
          <Input
            type="password"
            placeholder="Type in here…"
            id="password"
            name="password"
            fullWidth
            
          />
        </div>
          </div>
          {state?.errors?.password && (
        <div style={{ display: 'table-row' }}>
          <div style={{ display: 'table-cell' }}></div>
          <div style={{ display: 'table-cell' , color:'#f50057'}}>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
          </div>
        </div>
          )}
        </div>
        <input id="role" value={role} onChange={e => setRole(e.target.value as "teacher" | "student")} name="role" type='text' readOnly hidden />
        <Button variant='contained' disabled={pending} type="submit">
          Login
        </Button>
      </form>

      <Link href="/signup">
        <Button startIcon={<ExitToApp/>} color="secondary"  variant="contained">
          Signup
        </Button>    
      </Link>
    </div>
  )
}