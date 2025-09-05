"use server";
import { z } from "zod";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "users.json");

// Helper to read users from file
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

// Helper to write users to file
function writeUsers(users: any[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Replace in-memory users with file-based users
function getUsers() {
  return readUsers();
}

const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(4, { message: "Be at least 4 characters long" })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

// Signup function to add new users
export async function signup(prevState: any, formData: FormData) {
  const res = SignupFormSchema.safeParse(Object.fromEntries(formData));
  if (!res.success) {
    return {
      errors: res.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = res.data;
  const users = getUsers();
  if (users.some((u: any) => u.email === email)) {
    return {
      errors: {
        email: ["Email already registered"],
      },
    };
  }

  users.push({ name, email, password });
  writeUsers(users);
  await createSession(email);
  redirect("/dashboard");
}

// Login function for multi-user auth
export async function login(prevState: any, formData: FormData) {
  const res = SignupFormSchema.safeParse(Object.fromEntries(formData));
  if (!res.success) {
    return {
      errors: res.error.flatten().fieldErrors,
    };
  }

  const { email, password } = res.data;
  const users = getUsers();
  const user = users.find(
    (u: any) => u.email === email && u.password === password
  );

  if (user) {
    await createSession(user.id);
    redirect("/dashboard");
  } else {
    return {
      errors: {
        email: ["Invalid Email or password"],
      },
    };
  }
}
