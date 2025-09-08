"use client"
import { setUser } from "@/redux_files/user/userDataSlice";

export function getUserLocalData(){
    let data:any = localStorage.getItem("UserData");
    return JSON.parse(data);
}

export function setUserReduxData(dispatch:any){
    let data = getUserLocalData();
    dispatch(setUser(data));
}

