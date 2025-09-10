"use server"
import { SignupFormSchema, FormState, LoginFormSchema } from '@/app/lib/types'
import { filereader, filewriter, getUserData, userRegisterd } from '../lib/filecompo'
import { error } from 'console'
import { redirect } from 'next/navigation'
import { createSession } from '../lib/session'
import { json, success } from 'zod'
import { cookies } from 'next/headers'
 
export async function signup(state: FormState, formData: FormData) {
  // Validate role field first
  const roleField = SignupFormSchema.pick({ role: true }).safeParse({
    role: formData.get('role')
  });

  if (!roleField.success) {
    return {
      errors: roleField.error.flatten().fieldErrors,
    };
  }

  const { role } = roleField.data;

  let validatedFields;
  let userData: any;

  if (role === "teacher") {
    validatedFields = SignupFormSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
      subject: formData.get('subject')
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    userData = validatedFields.data; // includes subject

  } else {
    validatedFields = SignupFormSchema.omit({ subject: true }).safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role')
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    userData = validatedFields.data; // does not include subject
  }

  const { email } = userData;
  const isOld = await userRegisterd(email, role);

  if (!isOld) {
    let olddata = await filereader(role);
    olddata = [...olddata , userData];
    await filewriter(olddata, role);
    olddata = await filereader(role,true);
    let data = { email, data: userData };
    if(role == "student"){
      olddata = [...olddata , data];
    }else{
      olddata = olddata.teacherData;
      olddata = [...olddata , data];
    }
    await filewriter(olddata, role, true);
    await createSession(email, role);
    const data1 = await getUserData(email , role , true);
    return {
      success: true,
      userData: data1
    };
  } else {
    return {
      errors: {
        email: ["Email already registered!!"]
      }
    };
  }
}

export async function Login(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role')
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  const { email, password, role } = validatedFields.data;
  const isOld = await userRegisterd(email, role);
  const data = await getUserData(email , role , true);
  if(!isOld){
      return {
        errors:{
            email:["Email not registered!!"]
            }
        }

    }else{
        await createSession(email , role);
        return{
          success: true ,
          userData:data
        } 
    }
}

export async function Logout1(state: FormState, formData: FormData) {
  const cookieStore = cookies();
  if((await cookieStore).get('session')){
    (await cookieStore).delete('session');
  }
  return { success: true };
}