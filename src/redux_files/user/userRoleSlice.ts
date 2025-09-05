import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
  userData: {
    name: string;
    email: string;
    role: string;
    subject?: string;
    // Add other user fields as needed
  } | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  userData: null,
};

const userRoleSlice = createSlice({
  name: "userRole",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<any>) => {
      state.userData = action.payload;
      state.isLoggedIn = true;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUserData, clearUserData } = userRoleSlice.actions;
export default userRoleSlice.reducer;
