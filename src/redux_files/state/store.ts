import { configureStore } from "@reduxjs/toolkit";
import StudentReducer from "@/redux_files/user/studentSlice";
import TeacherReducer from "@/redux_files/user/TeacherSlice";
import AllStudentReducer from "@/redux_files/user/AllStudentSlice";
export const store = configureStore({
  reducer: {
    StudentData: StudentReducer,
    TeacherData: TeacherReducer,
    AllStudentData: AllStudentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
