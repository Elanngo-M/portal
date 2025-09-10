"use client";

import { setAssignments, setStudents } from "@/redux_files/user/AllStudentSlice";
import { setStudent, submitAssignment } from "@/redux_files/user/studentSlice";
import { setTeacher } from "@/redux_files/user/TeacherSlice";
import { assignmentSubmit } from "./types";

export function getUserLocalData() {
  const data = localStorage.getItem("UserData");
  return data ? JSON.parse(data) : null;
}

export function setStudentReduxData(dispatch: any) {
  const data = getUserLocalData();
  if (data?.data) {
    dispatch(setStudent(data.data));
  }else{
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


