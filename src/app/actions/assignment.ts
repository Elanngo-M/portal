"use server";

import { redirect } from "next/navigation";
import { filereader, writeAssignment } from "../lib/filecompo";

export async function AddAssingmenttoStudent(state: any, formData: FormData) {
  const studentsString = formData.get("students");
  const assignmentName = formData.get("name");

  if (!assignmentName) {
    return { error: "Assignment name is required" };
  }

  if (!studentsString) {
    return { error: "Please select at least one student" };
  }

  try {
    const selectedStudents = JSON.parse(studentsString as string);

    if (!Array.isArray(selectedStudents) || selectedStudents.length === 0) {
      return { error: "Please select at least one student" };
    }

    const assignment = {
      name: assignmentName,
      student: selectedStudents.map((student) => student.email),
    };

    console.log("Processing assignment:", assignment);
    await writeAssignment(assignment);

    return {
      success: true,
      message: `Assignment created for ${selectedStudents.length} students`,
    };
  } catch (error) {
    console.error("Error processing assignment:", error);
    return {
      error: "Failed to create assignment",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}
