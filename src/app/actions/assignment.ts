"use server";

import { redirect } from "next/navigation";
import { filereader, filewriter, writeAssignment } from "../lib/filecompo";
import { assignment} from "../lib/types";

export async function AddAssingmenttoStudent(state: any, formData: FormData) {
  const studentsString = formData.get("students");
  const assignmentName = formData.get("name");
  const subject = formData.get("subject");
  const teacher = formData.get("teacher");
  const dueDate = formData.get("dueDate");
  const minCount= formData.get("minCount");

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

    const assignment:assignment = {
      name: assignmentName,
      student: selectedStudents.map((student) => student),
      subject: subject,
      teacher: teacher,
      dueDate: dueDate,
      minCount: minCount,
      submitted: [],
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

export async function SubmitAssignmentAnswer(state: any, formData: FormData) {
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
    const assignments = await filereader("assignment", true);

    const assignmentIndex = assignments.findIndex(
  (a: any) => a.name === name && a.teacher === teacher
);


    const assignment = assignments[assignmentIndex];

    const alreadySubmitted = assignment.submitted?.some(
      (s: any) => s.student === studentName
    );

    if (alreadySubmitted) {
      return { error: "Assignment already submitted" };
    }

    assignment.submitted.push({ student: studentName, answer: answer });

    await filewriter(assignments, "assignment", true);

    return {
      success: true,
      message: "Assignment submitted successfully",
      updatedAssignment: assignment,
    };
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return {
      error: "Failed to submit assignment",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function SubmitRating(state: any, formData: FormData) {
  const assignmentName = formData.get("assignmentName");
  const studentName = formData.get("studentName");
  const grade = formData.get("rating");
  const teacher = formData.get("teacher");

  if (!assignmentName || !studentName || grade === null) {
    return { error: "Missing required fields" };
  }

  try {
    const assignments = await filereader("assignment", true);

    const assignmentIndex = assignments.findIndex(
  (a: any) => a.name === assignmentName && a.teacher === teacher
);


    const assignment = assignments[assignmentIndex];

    const submissionIndex = assignment.submitted.findIndex(
      (s: any) => s.student === studentName
    );

    if (submissionIndex === -1) {
      return { error: "Submission not found for student" };
    }

    assignment.submitted[submissionIndex].grade = Number(grade);

    await filewriter(assignments, "assignment", true);

    return {
      success: true,
      message: "Rating submitted successfully",
      updatedAssignment: assignment,
    };
  } catch (error) {
    console.error("Error submitting rating:", error);
    return {
      error: "Failed to submit rating",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}
