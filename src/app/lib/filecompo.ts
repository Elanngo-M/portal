import "server-only";
import fs from "fs";
import path from "path";
import { assignment } from "./types";

const basePath = path.join(process.cwd(), "src/app/data");

export async function filereader(role: string, datafile = false) {
  const studentDataFile = path.join(basePath, "students-data.json");
  let mainFile: string;

  if (datafile) {
    switch (role) {
      case "student":
        mainFile = studentDataFile;
        break;
      case "teacher":
        mainFile = path.join(basePath, "teachers-data.json");
        break;
      case "assignment":
        mainFile = path.join(basePath, "assignments.json");
        break;
      default:
        return [];
    }
  } else {
    mainFile = path.join(basePath, role === "student" ? "students.json" : "teachers.json");
  }

  if (!fs.existsSync(mainFile)) return [];

  try {
    const fileContent = fs.readFileSync(mainFile, "utf-8");
    const parsedData = JSON.parse(fileContent);

    if (datafile && role === "teacher") {
      if (!fs.existsSync(studentDataFile)) return [];
      const studentContent = fs.readFileSync(studentDataFile, "utf-8");
      return {
        teacherData: parsedData,
        studentData: JSON.parse(studentContent),
      };
    }

    return parsedData;
  } catch (error) {
    console.error(`Error reading ${role} file:`, error);
    return [];
  }
}

export async function getUserData(email: string, role: string, datafile = false) {
  const users = await filereader(role, datafile);
  console.log(users)
  const assignments = await filereader("assignment", true);

  if (datafile && role === "teacher") {
    const teacher = users.teacherData.find((u: any) => u.email === email) || null;
    const students = users.studentData;
    const assignmentData = assignments.filter((a: any) => a.teacher === email);

    return {
      data: {
        teacherData: teacher,
        studentData: { students },
        assignmentData,
      },
    };
  }

  if (datafile && role === "student") {
    const student = users.find((u: any) => u.email === email) || null;
   const assignmentData = assignments.filter((a: any) =>
        a.assignedStudents.includes(email)
    );


    return {
      data: {
        studentData: student,
        assignmentData,
      },
    };
  }

  return users.find((u: any) => u.email === email) || null;
}

export async function filewriter(data: any, role: string, datafile = false) {
  const fileName = datafile
    ? role === "student"
      ? "students-data.json"
      : role === "teacher"
      ? "teachers-data.json"
      : "assignments.json"
    : role === "student"
    ? "students.json"
    : "teachers.json";

  const filePath = path.join(basePath, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}


export async function userRegisterd(email: string, role: string) {
  const users = await filereader(role);
  return users.some((u: any) => u.email === email);
}

export async function writeAssignment(assignment: assignment) {
  const assignments = await filereader("assignment", true);
  assignments.push({
    name: assignment.name,
    subject: assignment.subject,
    teacher: assignment.teacher,
    dueDate: assignment.dueDate,
    assignedStudents: assignment.student,
    minCount : assignment.minCount,
    submitted: assignment.submitted,
  });

  const filePath = path.join(basePath, "assignments.json");
  fs.writeFileSync(filePath, JSON.stringify(assignments, null, 2));
}
