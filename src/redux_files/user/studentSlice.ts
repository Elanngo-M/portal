import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AssignmentType {
  name:string | null;
}
interface StudentState {
  data: { role: string; email: string | null; name: string | null };
  assignments: AssignmentType[];
}
const initialState: StudentState = {
  data: { role: "", email: null, name: null },
  assignments: []
};

const StudentSlice = createSlice({
  name: "StudentData",
  initialState,
  reducers: {
    setStudent: (
      state,
      action: PayloadAction<{ data:{role: string; email: string; name: string}, assignments:AssignmentType[] }>
    ) => {
      state.data.role = action.payload.data.role ?? "";
      state.data.email = action.payload.data.email ?? "";
      state.data.name = action.payload.data.name ?? "";
      state.assignments = action.payload.assignments?? [];
    },
    clearStudent: (state) => {
      state.data.role = "";
      state.data.email = null;
      state.data.name = null;
    },
  },
});

export const { setStudent, clearStudent } = StudentSlice.actions;
export default StudentSlice.reducer;
