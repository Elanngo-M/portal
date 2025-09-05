'use client'
 
import { signup } from '@/app/actions/auth'
import { useActionState, useState } from 'react'
 
export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)
  const [role , setRole] = useState<"teacher" | "student">("teacher");
  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}
 
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}
 
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
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
    <div>
      <label htmlFor="role">Role</label>
      <select onChange={e => setRole(e.target.value as "teacher" | "student")} value={role} id="role" name="role">
        <option value="teacher">Teacher</option>
        <option value="student">Student</option>
      </select>
    </div>

     {role == "teacher" ? (
        <div>
            <label htmlFor="subject">Subject</label>
            <select id="subject" name="subject">
                <option value="maths">Maths</option>
                <option value="science">Sceince</option>
                <option value="social">Social</option>
                <option value="english">English</option>
                <option value="tamil">Tamil</option>
            </select>
        </div>
     ) : null}

      <button disabled={pending} type="submit">
        Sign Up
      </button>
    </form>
  )
}