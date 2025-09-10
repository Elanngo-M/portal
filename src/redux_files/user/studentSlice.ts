import { assignment, assignmentSubmit } from "@/app/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StudentState {
  data: {
    role: string;
    email: string | null;
    name: string | null;
  };
  assignments: assignment[];
}

const initialState: StudentState = {
  data: { role: "", email: null, name: null },
  assignments: [],
};

const StudentSlice = createSlice({
  name: "StudentData",
  initialState,
  reducers: {
    setStudent: (
      state,
      action: PayloadAction<{
        studentData: {
          email: string;
          data: { role: string; email: string; name: string };
        };
        assignmentData: assignment[];
      }>
    ) => {
      const { studentData, assignmentData } = action.payload;
      state.data.role = studentData.data.role ?? "";
      state.data.email = studentData.data.email ?? "";
      state.data.name = studentData.data.name ?? "";
      state.assignments = assignmentData ?? [];
    },

    clearStudent: (state) => {
      state.data = { role: "", email: null, name: null };
      state.assignments = [];
    },

    submitAssignment: (state, action: PayloadAction<assignmentSubmit>) => {
      const { name, studentName, answer } = action.payload;

      const assignmentIndex = state.assignments.findIndex(
        (a) => a.name === name
      );

      if (assignmentIndex !== -1) {
        const assignment = state.assignments[assignmentIndex];

        // Prevent duplicate submissions
        const alreadySubmitted = assignment.submitted?.some(
          (s) => s.student === studentName
        );

        if (!alreadySubmitted) {
          assignment.submitted = [
            ...(assignment.submitted || []),
            { student: studentName, answer , grade:null},
          ];
        }
      }
    },
  },
});

export const { setStudent, clearStudent, submitAssignment } = StudentSlice.actions;
export default StudentSlice.reducer;
