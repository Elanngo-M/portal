import { configureStore } from "@reduxjs/toolkit";
import userRoleReducer from "@/redux_files/user/userRoleSlice"
export const store = configureStore({
    reducer:{
       userRole:userRoleReducer,
    }
})

export type RootState = ReturnType <typeof store.getState>;
export type AppDispatch = typeof store.dispatch;