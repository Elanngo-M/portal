import { assignment } from "@/app/lib/types";
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
    students : StudentState[],
    assignments: assignment[],
}

const initialState: AllStudentState = {
  students:[],
  assignments: [],
};

const AllStudentSlice = createSlice({
  name: "AllStudentData",
  initialState,
  reducers: {
    setStudents: (
      state,
      action: PayloadAction<AllStudentState>
    ) => {
        state.students = action.payload?.students;
    },
    clearStudents: (state) => {
      state.students = [];
    },
    setAssignments:(
      state,
      action: PayloadAction<assignment[]>
    )=>{
      state.assignments = action.payload;
    }
  },
});

export const { setStudents, clearStudents , setAssignments } = AllStudentSlice.actions;
export default AllStudentSlice.reducer;
