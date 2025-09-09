import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StudentState {
  email: string,
  data: {
    role: string;
    email: string | null;
    name: string | null;
  }
}

interface AllStudentState{
    students : StudentState[]
}

const initialState: AllStudentState = {
  students:[]
};

const AllStudentSlice = createSlice({
  name: "AllStudentData",
  initialState,
  reducers: {
    setStudents: (
      state,
      action: PayloadAction<AllStudentState>
    ) => {
        state.students = action.payload.students;
    },
    clearStudents: (state) => {
      state.students = [];
    },
  },
});

export const { setStudents, clearStudents } = AllStudentSlice.actions;
export default AllStudentSlice.reducer;
