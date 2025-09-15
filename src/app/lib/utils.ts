"use client";
import { openDB } from "idb";
import {
  setAssignments,
  setStudents,
} from "@/redux_files/user/AllStudentSlice";
import { setStudent, submitAssignment } from "@/redux_files/user/studentSlice";
import { setTeacher } from "@/redux_files/user/TeacherSlice";
import { assignment, assignmentSubmit, Student, Teacher } from "./types";
const myDBversion = 3;

let TeacherData = [
  {
    name: "Admin",
    email: "myemail@gmail.com",
    password: "myemail@1",
    role: "teacher",
    subject: "maths",
  },
  {
    name: "Daily Journal",
    email: "admin@gmail.com",
    password: "admin@gmail1",
    role: "teacher",
    subject: "Tamil",
  },
  {
    name: "Idris",
    email: "idris@gmail.com",
    password: "idris@1234567",
    role: "teacher",
    subject: "Social",
  },
  {
    name: "Idris",
    email: "idris@123.com",
    password: "idris@1234567",
    role: "teacher",
    subject: "Maths",
  },
  {
    name: "Karthik",
    email: "karthik@gmail.com",
    password: "karthick@123",
    role: "teacher",
    subject: "English",
  },
  {
    name: "Leo",
    email: "leo@gmail.com",
    password: "leo@12345",
    role: "teacher",
    subject: "Tamil",
  },
];
const studentData = [
  {
    email: "myemail@gmail.com",
    data: {
      name: "Elanngo Madheswaran",
      role: "student",
      password:"myemail@1",
      email: "myemail@gmail.com",
    },
    assignments: [{ name: "Assignment 1" }, { name: "Assignment 2" }],
  },
  {
    email: "elanngo@gmail.com",
    data: {
      name: "Elanngo",
      email: "elanngo@gmail.com",
      password: "elanngo@gmail1",
      role: "student",
    },
    assignments: [
      { name: "Assignment 1" },
      { name: "English Ass" },
      { name: "Assignment 2" },
    ],
  },
  {
    email: "elanngo12@gmail.com",
    data: {
      name: "Elanngo",
      email: "elanngo12@gmail.com",
      password: "elanngo@123",
      role: "student",
    },
  },
  {
    email: "idris@gmail.com",
    data: {
      name: "Idris",
      email: "idris@gmail.com",
      password: "idris@1234567",
      role: "student",
    },
  },
  {
    email: "leo@gmail.com",
    data: {
      name: "Leo",
      email: "leo@gmail.com",
      password: "leo@12345",
      role: "student",
    },
  },
];

const AssignmentData = [
  {
    name: "Assignment 8",
    subject: "maths",
    teacher: "myemail@gmail.com",
    dueDate: "2025-09-27",
    assignedStudents: ["myemail@gmail.com", "idris@gmail.com"],
    minCount: "200",
    submitted: [
      {
        student: "myemail@gmail.com",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tincidunt aliquam est, in viverra massa. Pellentesque blandit arcu purus, non mattis est iaculis eu. Nullam non dolor quis orci pretium ornare. Quisque finibus erat augue, a cursus nulla vehicula non. Morbi fringilla massa convallis, interdum tortor et, euismod augue. Aliquam non magna non ligula volutpat placerat nec vel arcu. Ut porta mattis nisl, at faucibus metus tempus non. Pellentesque non facilisis justo.\r\n\r\nOrci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis fringilla mauris vel sapien malesuada mattis. Pellentesque eu justo non metus lobortis blandit. Sed eleifend arcu eu massa ultrices mollis. Vestibulum bibendum, quam sed tristique viverra, diam massa gravida metus, a mollis tortor nisi vitae lorem. Cras nec tempus justo. Phasellus eu suscipit justo. Cras finibus felis sit amet odio fringilla commodo. Etiam feugiat eu felis a euismod. Integer nec mauris risus. Cras nec molestie augue. Duis nec tempus tortor.\r\n\r\nSed vitae eros leo. Mauris eu lorem auctor, placerat nisi vel, efficitur libero. Phasellus eu neque non orci egestas sodales. Duis venenatis ligula non arcu tincidunt faucibus. Suspendisse tempor imperdiet posuere. Sed viverra lacus in nulla ultricies accumsan. Nunc ante nisi, ultricies sit amet diam.",
        grade: 3,
      },
      {
        student: "idris@gmail.com",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non sagittis quam. Integer mattis eros in felis aliquet, a rhoncus purus elementum. Sed vitae tellus pulvinar, tincidunt orci sed, cursus leo. Ut sed elit sit amet odio pharetra imperdiet sed quis justo. Integer efficitur suscipit ante, dapibus suscipit sapien. Mauris ultricies quis metus vitae venenatis. Quisque finibus libero a ipsum iaculis, ac efficitur ipsum luctus. Aliquam purus justo, auctor ac risus nec, dictum tristique sem. Cras fermentum, sapien non efficitur aliquet, lacus augue placerat purus, condimentum volutpat urna justo eu tortor.\r\n\r\nNunc sagittis lorem non felis convallis faucibus. Nunc pulvinar ultrices velit, at faucibus erat pretium sed. Sed id semper urna. Aliquam lacinia luctus diam, at semper ligula tempus id. Vivamus consequat consequat mauris sit amet finibus. Aliquam aliquet nunc a ligula pharetra aliquam. Duis pharetra rhoncus ante, at volutpat sapien hendrerit a.\r\n\r\nCras placerat condimentum orci, eget feugiat nibh vestibulum quis. Vivamus in neque aliquet, egestas orci in, consectetur enim. Integer interdum risus nisl, eu elementum ex pellentesque et. Ut commodo et odio quis pharetra. Nunc iaculis tincidunt nibh, ac consectetur nisl aliquet pulvinar. In dignissim massa ligula, vitae finibus tellus suscipit sit amet. Praesent sagittis eros id efficitur.",
        grade: 2,
      },
    ],
  },
  {
    name: "Assignment 10",
    subject: "maths",
    teacher: "myemail@gmail.com",
    dueDate: "2025-09-17",
    assignedStudents: [
      "myemail@gmail.com",
      "elanngo@gmail.com",
      "elanngo12@gmail.com",
      "idris@gmail.com",
    ],
    minCount: "100",
    submitted: [
      {
        student: "idris@gmail.com",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a mauris blandit, vestibulum sapien eu, aliquam diam. Sed suscipit porttitor est vitae sollicitudin. Duis viverra velit ac erat mollis, ut consectetur turpis malesuada. Quisque bibendum vel neque vitae consectetur. Nunc rhoncus tempus urna vel placerat. Etiam vitae vestibulum velit, eu semper mi. Morbi nisi arcu, porttitor a lectus ac, placerat dictum tellus. Etiam rutrum lectus augue, facilisis consectetur velit sodales tempor. Praesent sit amet felis tristique, sollicitudin tortor vitae, pulvinar est. Aenean a mi et arcu mollis consectetur. Morbi non enim id nisl malesuada tincidunt. Nulla sagittis libero non enim.",
        grade: 2.5,
      },
      {
        student: "myemail@gmail.com",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lobortis ante vitae massa tincidunt dapibus. Nulla risus lacus, porttitor nec lectus ut, maximus lobortis dolor. Aenean ac dignissim felis. Nulla ornare vestibulum aliquet. Morbi fringilla vel lectus iaculis pretium. Mauris ullamcorper euismod porttitor. Maecenas gravida nisi est, vel mattis velit faucibus eget. Donec dignissim, lectus molestie volutpat egestas, nunc nibh interdum nibh, in maximus enim odio non massa. Fusce non nunc non mi mattis venenatis. Proin tempus massa id sodales interdum. Vivamus quis sollicitudin mi. Nullam sagittis sapien ac aliquet vehicula. Maecenas fringilla lacinia lacus a lobortis. Praesent gravida nisi.",
        grade: 3.5,
      },
    ],
  },
  {
    name: "Assignment 1",
    subject: "Social",
    teacher: "idris@gmail.com",
    dueDate: "2025-09-13",
    assignedStudents: ["myemail@gmail.com", "leo@gmail.com"],
    minCount: "50",
    submitted: [
      {
        student: "myemail@gmail.com",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus sollicitudin tortor quis vestibulum. Suspendisse potenti. Praesent pretium fringilla orci, in fringilla ex molestie quis. Duis mi diam, aliquam et scelerisque in, consequat eu orci. Donec auctor elit at cursus blandit. Aliquam ligula arcu, laoreet in dapibus sit amet, auctor.",
        grade: 3.5,
      },
    ],
  },
  {
    name: "Assignment 1",
    subject: "maths",
    teacher: "myemail@gmail.com",
    dueDate: "2025-09-18",
    assignedStudents: ["myemail@gmail.com", "elanngo@gmail.com"],
    minCount: "31",
    submitted: [
      {
        student: "myemail@gmail.com",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat bibendum nibh, nec egestas eros sodales venenatis. Maecenas quis elementum mi. Ut mi erat, hendrerit in consectetur ac, mollis ut leo. Aliquam sollicitudin neque sed odio tempus consequat sit amet.",
        grade: 3.5,
      },
    ],
  },
  {
    name: "Assignment 2",
    subject: "maths",
    teacher: "myemail@gmail.com",
    dueDate: "2025-09-18",
    assignedStudents: ["myemail@gmail.com"],
    minCount: "31",
    submitted: [
      {
        student: "myemail@gmail.com",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat bibendum nibh, nec egestas eros sodales venenatis. Maecenas quis elementum mi. Ut mi erat, hendrerit in consectetur ac, mollis ut leo. Aliquam sollicitudin neque sed odio tempus consequat sit amet.",
        grade: 3,
      },
    ],
  },
  {
    name: "Assignment 2",
    subject: "Social",
    teacher: "idris@gmail.com",
    dueDate: "2025-09-18",
    assignedStudents: ["myemail@gmail.com"],
    minCount: "31",
    submitted: [
      {
        student: "myemail@gmail.com",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat bibendum nibh, nec egestas eros sodales venenatis. Maecenas quis elementum mi. Ut mi erat, hendrerit in consectetur ac, mollis ut leo. Aliquam sollicitudin neque sed odio tempus consequat sit amet.",
      },
    ],
  },
  {
    name: "Assignment 6",
    subject: "maths",
    teacher: "myemail@gmail.com",
    dueDate: "2025-09-23",
    assignedStudents: [
      "myemail@gmail.com",
      "elanngo@gmail.com",
      "elanngo12@gmail.com",
      "idris@gmail.com",
      "leo@gmail.com",
    ],
    minCount: "31",
    submitted: [
      {
        student: "myemail@gmail.com",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus urna neque, vel auctor massa tempus id. Praesent ultrices orci urna, quis pretium nunc malesuada eget. Fusce a tellus. e a tellus.",
        grade: 3.5,
      },
    ],
  },
  {
    name: "Dead poet's society ",
    subject: "English",
    teacher: "karthik@gmail.com",
    dueDate: "2025-09-23",
    assignedStudents: ["myemail@gmail.com"],
    minCount: "30",
    submitted: [],
  },
  {
    name: "Assignment 3",
    subject: "maths",
    teacher: "myemail@gmail.com",
    dueDate: "2025-09-25",
    assignedStudents: ["elanngo@gmail.com", "myemail@gmail.com"],
    minCount: "030",
    submitted: [
      {
        student: "myemail@gmail.com",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel leo nulla. Nam facilisis ut quam sagittis egestas. Aliquam ac ex ultrices, feugiat ipsum quis, tincidunt velit. Nam maximus elementum.",
        grade: 2.5,
      },
    ],
  },
  {
    name: "Assignment 4",
    subject: "maths",
    teacher: "myemail@gmail.com",
    dueDate: "2025-09-25",
    assignedStudents: ["myemail@gmail.com"],
    minCount: "030",
    submitted: [],
  },
];

// export function addTeacher() {
//   let DB: any;

//   let TeacherData = [
//     {
//       name: "Admin",
//       email: "myemail@gmail.com",
//       password: "myemail@1",
//       role: "teacher",
//       subject: "maths",
//     },
//     {
//       name: "Daily Journal",
//       email: "admin@gmail.com",
//       password: "admin@gmail1",
//       role: "teacher",
//       subject: "Tamil",
//     },
//     {
//       name: "Idris",
//       email: "idris@gmail.com",
//       password: "idris@1234567",
//       role: "teacher",
//       subject: "Social",
//     },
//     {
//       name: "Idris",
//       email: "idris@123.com",
//       password: "idris@1234567",
//       role: "teacher",
//       subject: "Maths",
//     },
//     {
//       name: "Karthik",
//       email: "karthik@gmail.com",
//       password: "karthick@123",
//       role: "teacher",
//       subject: "English",
//     },
//     {
//       name: "Leo",
//       email: "leo@gmail.com",
//       password: "leo@12345",
//       role: "teacher",
//       subject: "Tamil",
//     },
//   ];

//   const request = window.indexedDB.open("MyDB", 1);
//   request.onerror = (event: any) => {
//     console.error(`Database error: ${event?.target?.error?.message}`);
//   };
//   request.onsuccess = (event: any) => {
//     DB = event?.target?.result;
//   };
//   request.onupgradeneeded = (event: any) => {
//     const db = event.target.result;
//     const objStore = db.createObjectStore("Teachers", { autoIncrement: true });
//     objStore.createIndex("name", "name", { unique: false });
//     objStore.createIndex("email", "email", { unique: true });
//     objStore.createIndex("password", "password", { unique: false });
//     objStore.createIndex("role", "role", { unique: false });
//     objStore.createIndex("subject", "subject", { unique: false });
//     objStore.transaction.oncomplete = (event: any) => {
//       const customerObjectStore = db
//         .transaction("Teachers", "readwrite")
//         .objectStore("Teachers");
//       TeacherData.forEach((Teacher: any) => {
//         customerObjectStore.add(Teacher);
//       });
//     };
//   };
// }

// export function addStudents() {
//   let DB: any;

//   const request = window.indexedDB.open("MyDB", 2);

//   request.onerror = (event: any) => {
//     console.error(`Database error: ${event?.target?.error?.message}`);
//   };

//   request.onsuccess = (event: any) => {
//     DB = event?.target?.result;
//   };

//   request.onupgradeneeded = (event: any) => {
//     const db = event.target.result;

//     const objStore = db.createObjectStore("Students", { autoIncrement: true });
//     objStore.createIndex("email", "email", { unique: true });
//     objStore.createIndex("data", "data", { unique: false });
//     objStore.createIndex("assignments", "assignments", { unique: false });

//     objStore.transaction.oncomplete = () => {
//       const studentObjectStore = db
//         .transaction("Students", "readwrite")
//         .objectStore("Students");

//       studentData.forEach((student: any) => {
//         studentObjectStore.add(student);
//       });
//     };
//   };
// }

// export function addAssignments() {
//   let DB: any;

//   const request = window.indexedDB.open("MyDB", 3);

//   request.onerror = (event: any) => {
//     console.error(`Database error: ${event?.target?.error?.message}`);
//   };

//   request.onsuccess = (event: any) => {
//     DB = event?.target?.result;
//   };

//   request.onupgradeneeded = (event: any) => {
//     const db = event.target.result;

//     const objStore = db.createObjectStore("Assignments", {
//       autoIncrement: true,
//     });
//     objStore.createIndex("name", "name", { unique: false });
//     objStore.createIndex("subject", "subject", { unique: false });
//     objStore.createIndex("teacher", "teacher", { unique: false });
//     objStore.createIndex("dueDate", "dueDate", { unique: false });
//     objStore.createIndex("assignedStudents", "assignedStudents", {
//       unique: false,
//     });
//     objStore.createIndex("minCount", "minCount", { unique: false });
//     objStore.createIndex("submitted", "submitted", { unique: false });

//     objStore.transaction.oncomplete = () => {
//       const assignmentObjectStore = db
//         .transaction("Assignments", "readwrite")
//         .objectStore("Assignments");

//       AssignmentData.forEach((assignment: any) => {
//         assignmentObjectStore.add(assignment);
//       });
//     };
//   };
// }

export async function useDB() {
  const dbPromise = await openDB("MyDB", myDBversion, {
    upgrade(db) {
      // Teachers Store
      if (!db.objectStoreNames.contains("Teachers")) {
        const teacherStore = db.createObjectStore("Teachers", {
          keyPath:"email"
        });
        teacherStore.createIndex("name", "name", { unique: false });
        teacherStore.createIndex("email", "email", { unique: true });
        teacherStore.createIndex("password", "password", { unique: false });
        teacherStore.createIndex("role", "role", { unique: false });
        teacherStore.createIndex("subject", "subject", { unique: false });

        // Populate Teachers
        TeacherData.forEach((teacher) => {
          teacherStore.add(teacher);
        });
      }

      // Students Store
      if (!db.objectStoreNames.contains("Students")) {
        const studentStore = db.createObjectStore("Students", {
          keyPath:"email"
        });
        studentStore.createIndex("email", "email", { unique: true });
        studentStore.createIndex("data", "data", { unique: false });
        studentStore.createIndex("assignments", "assignments", { unique: false });

        // Populate Students
        studentData.forEach((student) => {
          studentStore.add(student);
        });
      }

      // Assignments Store
      if (!db.objectStoreNames.contains("Assignments")) {
        const assignmentStore = db.createObjectStore("Assignments", {
          keyPath:"id",autoIncrement:true
        });
        assignmentStore.createIndex("name", "name", { unique: false });
        assignmentStore.createIndex("subject", "subject", { unique: false });
        assignmentStore.createIndex("teacher", "teacher", { unique: false });
        assignmentStore.createIndex("dueDate", "dueDate", { unique: false });
        assignmentStore.createIndex("assignedStudents", "assignedStudents", { unique: false });
        assignmentStore.createIndex("minCount", "minCount", { unique: false });
        assignmentStore.createIndex("submitted", "submitted", { unique: false });

        // Populate Assignments
        AssignmentData.forEach((assignment) => {
          assignmentStore.add(assignment);
        });
      }
    },
  });

  return dbPromise;
}

export async function addTeacher(NewTeacher: Teacher){
  const myDB = await openDB("MyDB", myDBversion);
  await myDB.add("Teachers",NewTeacher)
}

export async function addStudent(NewStudent: Student){
  const myDB = await openDB("MyDB", myDBversion);
  await myDB.add("Students",NewStudent)
}


export function getUserLocalData() {
  const data = localStorage.getItem("Current");
  return data ? JSON.parse(data) : null;
}

export function setStudentReduxData(dispatch: any) {
  const data = getUserLocalData();
  if (data?.data) {
    dispatch(setStudent(data.data));
  } else {
    dispatch(setStudent(data));
  }
}

export function setTeacherReduxData(dispatch: any) {
  const data = getUserLocalData();
  if (data?.teacherData?.data) {
    dispatch(setTeacher(data.teacherData.data));
  }
}

export function setAllStudentReduxData(dispatch: any) {
  const data = getUserLocalData();
  if (data?.studentData?.students) {
    dispatch(setStudents(data.studentData));
    dispatch(setAssignments(data.assignmentData));
  }
}

export function submitAsstoRedux(dispatch: any, assignment: assignmentSubmit) {
  dispatch(submitAssignment(assignment));
}


export async function isUserRegistered(email:any , role:any){
  const myDB = await openDB("MyDB", myDBversion);
  const table = role == "teacher" ? "Teachers" : "Students";
  const value = await myDB.get(table , email);
  if(value !== undefined){
    return true;
  }else{
    return false;
  }
}

export async function isPassMatch(email:any, role:any , password:any){
  const myDB = await openDB("MyDB", myDBversion);
  const table = role == "teacher" ? "Teachers" : "Students";
  const value = await myDB.get(table , email);
  if(role == "teacher" && value.password == password){
    return true;
  }else if(role == "student" && value.data.password == password){
    return true;
  }else{
    return false;
  }
}

export async function getStudent(email:any){
  const myDB = await openDB("MyDB", myDBversion);
  const value = await myDB.get("Students" , email);
  return value
}

export async function getAllStudent(){
  const myDB = await openDB("MyDB", myDBversion);
  const value = await myDB.getAll("Students");
  return value
}

export async function getTeacher(email:any){
  const myDB = await openDB("MyDB", myDBversion);
  const value = await myDB.get("Teachers" , email);
  return value
}

export async function getAssignment(email:any , role:any){
  const myDB = await openDB("MyDB", myDBversion);
  let res= <any>[];
  const assignments = await myDB.getAll("Assignments");
  if(role == "student"){
    assignments.forEach((assignment:assignment)=>{
      if(assignment.assignedStudents.includes(email)){
        res.push(assignment);
      }
    })
  }else{
    assignments.forEach((assignment:assignment)=>{
      if (assignment.teacher == email){
        res.push(assignment);
      }
    })
  }
  return res;
}

export async function writeAssignmentIDB(assignment: assignment) {
  const myDB = await openDB("MyDB", myDBversion);
  let newassignment= {
    name: assignment.name,
    subject: assignment.subject,
    teacher: assignment.teacher,
    dueDate: assignment.dueDate,
    assignedStudents: assignment.assignedStudents,
    minCount : assignment.minCount,
    submitted: assignment.submitted,
  };
  return await myDB.add("Assignments", newassignment);
}

export async function SubmitAssignmentAnswer(state: any, formData: FormData) {
  const myDB = await openDB("MyDB", myDBversion);
  const name= formData.get("name");
  const studentName= formData.get("studentName");
  const subject= formData.get("subject");
  const teacher= formData.get("teacher");
  const date= formData.get("date");
  const answer= formData.get("answer");

  if (!name || !studentName || !answer) {
    return { error: "Missing required fields" };
  }

  try {
    const assignments = await myDB.getAll("Assignments");
    const assignmentIndex = assignments.findIndex(
  (a: any) => a.name === name && a.teacher === teacher
);


    const assignment = assignments[assignmentIndex];
    console.log(assignment);
    const alreadySubmitted = assignment.submitted?.some(
      (s: any) => s.student === studentName
    );

    if (alreadySubmitted) {
      return { error: "Assignment already submitted" };
    }
    assignment.submitted.push({ student: studentName, answer: answer });
    await myDB.put("Assignments", assignment);

    return {
      success: true,
      message: "Assignment submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return {
      error: "Failed to submit assignment",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}