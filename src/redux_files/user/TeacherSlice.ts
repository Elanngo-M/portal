import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TeacherState {
  role: string;
  email: string | null;
  name: string | null;
  subject: string | null;
}

const initialState: TeacherState = {
  role: "",
  email: null,
  name: null,
  subject: null
};

const TeacherSlice = createSlice({
  name: "TeacherData",
  initialState,
  reducers: {
    setTeacher: (
      state,
      action: PayloadAction<{ role: string; email: string , name:string , subject:string }>
    ) => {
      state.role = action.payload.role ?? "";
      state.email = action.payload.email ?? "";
      state.name = action.payload.name ?? "";
      state.subject = action.payload.subject ?? "";
    },
    clearTeacher: (state) => {
      state.role = "";
      state.email = null;
      state.name = null;
      state.subject = null;
    },
  },
});

export const { setTeacher, clearTeacher } = TeacherSlice.actions;
export default TeacherSlice.reducer;
