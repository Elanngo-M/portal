'use client'
 
import { Login, signup } from '@/app/actions/auth'
import { useActionState } from 'react'
import { use } from 'react'
 
export default function LoginForm({
  params,
}: {
  params: Promise<{ user_role: string }>
}) {
  const { user_role } =use(params);
  const [state, action, pending] = useActionState(Login, undefined)
 
  return (
    <form action={action}>
      <p>{user_role} Form</p>
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
      <input id="role" name="role" type='text' readOnly hidden value={user_role=="teacher"? "teacher":"student"}/>
      <button disabled={pending} type="submit">
        Login
      </button>
    </form>
  )
}