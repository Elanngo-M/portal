import { any, z } from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
  role: z.string().trim(),
  subject: z.string().trim(),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
  role: z.string().trim(),
});

export type FormErrors = {
  email?: string[];
  password?: string[];
  role?: string[];
};

export type FormState =
  | {
      errors?:
        | {
            email?: string[];
            password?: string[];
            role?: string[];
          }
        | undefined;
      success?: boolean | false;
      userData?: {
        data: any;
      };
    }
  | undefined;

export type SingupFormState =
  | {
      errors?:
        | {
            name?: string[];
            email?: string[];
            password?: string[];
            role?: string[];
          }
        | undefined;
      success?: boolean | false;
      userData?: {
        data: any;
      };
    }
  | undefined;

export type assignment = {
  name: any;
  assignedStudents: any[];
  subject: any;
  teacher: any;
  dueDate: any;
  minCount: any;
  submitted:
    | {
        student: string;
        answer: string;
        grade: any;
      }[]
    | [];
};

export type assignmentSubmit = {
  name: any;
  studentName: any;
  subject: any;
  teacher: any;
  date: any;
  answer: any;
};

export type Teacher = {
  email: any;
  name: any;
  password: any;
  role: "teacher";
  subject: any;
};

export type Student = {
  email: any;
  data: {
    name: any;
    email: any;
    password: any;
    role: any;
  };
  assignments: { name: any }[] | [];
};
