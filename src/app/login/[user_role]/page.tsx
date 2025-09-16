'use client'

import { Login } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { use } from 'react'
import styles from './loginform.module.css'

import type { FormErrors, FormState } from '@/app/lib/types'
import {
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  Link
} from '@mui/material'
import MailIcon from '@mui/icons-material/Mail'
import KeyIcon from '@mui/icons-material/Key'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { ExitToApp } from '@mui/icons-material'
import { isPassMatch, isUserRegistered } from '@/app/lib/utils'
import { useThemeContext } from "@/app/ThemeContext"
import { useTheme } from '@mui/material/styles'

export default function LoginForm({
  params,
}: {
  params: Promise<{ user_role: string }>
}) {
  const { user_role } = use(params)
  const router = useRouter()
  const [state, action, pending] = useActionState<FormState, FormData>(Login, undefined)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState(user_role)
  const [localErrors, setLocalErrors] = useState<FormErrors>({})

  const { mode } = useThemeContext()
  const theme = useTheme()

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
      const data = user_role === "teacher"
        ? JSON.stringify(state?.userData?.data)
        : JSON.stringify(state?.userData)

      localStorage.setItem("UserData", data)
      localStorage.setItem("loggedIn:", "true")
    }
  }, [router, state, user_role])

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string
    const role = formData.get("role") as "teacher" | "student"

    const alreadyRegistered = await isUserRegistered(email, role)
    if (!alreadyRegistered) {
      setLocalErrors({ email: ["Email not registered!!"] })
      return
    }

    const userData: any = {
      name: formData.get("name"),
      email,
      password: formData.get("password"),
      role,
    }

    const res = await isPassMatch(email, role, userData.password)
    if (res) {
      const result = await Login(undefined, formData)
      if (result?.success) {
        localStorage.setItem("Current", JSON.stringify({ email: userData.email, role: userData.role }))
        router.push("/dashboard")
      } else {
        setLocalErrors(result.errors || {})
      }
    } else {
      setLocalErrors({ email: ["Invalid credentials"] })
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
        <form className={styles.form} action={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h5" textAlign="center">
              {role === "teacher" ? "Teacher" : "Student"} Login
            </Typography>

            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={!!localErrors.email}
              helperText={localErrors.email?.[0]}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />

            <TextField
              label="Password"
              variant="outlined"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={!!state?.errors?.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
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

            <input type="hidden" name="role" value={role} readOnly />

            <Button
              variant="contained"
              type="submit"
              disabled={pending}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
              }}
            >
              Login
            </Button>

            <Link href="/signup">
              New user? Signup
            </Link>
          </Stack>
        </form>
      </Paper>
    </div>
  )
}
