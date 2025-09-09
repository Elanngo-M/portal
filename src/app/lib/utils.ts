"use client";
import { setStudents } from "@/redux_files/user/AllStudentSlice";
import { setStudent } from "@/redux_files/user/studentSlice";
import { setTeacher } from "@/redux_files/user/TeacherSlice";

export function getUserLocalData() {
  let data: any = localStorage.getItem("UserData");
  return JSON.parse(data);
}

export function setStudentReduxData(dispatch: any) {
  let data = getUserLocalData();
  dispatch(setStudent(data));
}

export function setTeacherReduxData(dispatch: any) {
  let data = getUserLocalData();
  dispatch(setTeacher(data.teacherData?.data));
}

export function setAllStudentReduxData(dispatch: any) {
  let data = getUserLocalData();
  dispatch(setStudents(data.studentData));
}