import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  role: string;
  email: string | null;
  name: string | null;
  subject:string | null;
}

const initialState: UserState = {
  role: "",
  email: null,
  name: null,
  subject:null,
};

const userRoleSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ role: string; email: string , name:string , subject:string }>
    ) => {
      state.role = action.payload.role ?? "";
      state.email = action.payload.email ?? "";
      state.name = action.payload.name ?? "";
      state.subject = action.payload.subject ?? "";
    },
    clearUser: (state) => {
      state.role = "";
      state.email = null;
      state.name = null;
    },
  },
});

export const { setUser, clearUser } = userRoleSlice.actions;
export default userRoleSlice.reducer;
