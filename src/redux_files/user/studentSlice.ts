import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StudentState {
  role: string;
  email: string | null;
  name: string | null;
}

const initialState: StudentState = {
  role: "",
  email: null,
  name: null,
};

const StudentSlice = createSlice({
  name: "StudentData",
  initialState,
  reducers: {
    setStudent: (
      state,
      action: PayloadAction<{ role: string; email: string , name:string  }>
    ) => {
      state.role = action.payload.role ?? "";
      state.email = action.payload.email ?? "";
      state.name = action.payload.name ?? "";
    },
    clearStudent: (state) => {
      state.role = "";
      state.email = null;
      state.name = null;
    },
  },
});

export const { setStudent, clearStudent } = StudentSlice.actions;
export default StudentSlice.reducer;
