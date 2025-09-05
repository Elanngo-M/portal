// "use server"
// import { SignupFormSchema, FormState, LoginFormSchema } from '@/app/lib/types'
// import { filewriter, useRegisterd } from '../lib/filecompo'
// import { error } from 'console'
// import { redirect } from 'next/navigation'
// import { createSession } from '../lib/session'
 
// export async function signup(state: FormState, formData: FormData) {
//   // Validate form fields
//   const validatedFields = SignupFormSchema.safeParse({
//     name: formData.get('name'),
//     email: formData.get('email'),
//     password: formData.get('password'),
//   })
 
//   // If any form fields are invalid, return early
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     }
//   }
 
//   const { name, email, password } = validatedFields.data
//   const isOld = await useRegisterd(email);
//   if(!isOld){
//       filewriter(validatedFields.data);
//       await createSession(email);
//       redirect("/dashboard");
//   }else{
//     return {
//         errors:{
//             email:["Email already registered!!"]
//             }
//         }
//     }
// }

// export async function Login(state: FormState, formData: FormData) {
//   // Validate form fields
//   const validatedFields = LoginFormSchema.safeParse({
//     email: formData.get('email'),
//     password: formData.get('password'),
//   })
 
//   // If any form fields are invalid, return early
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     }
//   }
 
//   const { email, password } = validatedFields.data
//   const isOld = await useRegisterd(email);
//   if(!isOld){
//       return {
//         errors:{
//             email:["Email not registered!!"]
//             }
//         }
//     }else{
//         await createSession(email);
//         redirect("/dashboard");
//     }
// }