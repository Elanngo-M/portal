"use client";

import { Logout1 } from "@/app/actions/auth";
import { RootState } from "@/redux_files/state/store";
import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserReduxData } from "../lib/utils";

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.userData);
  const router = useRouter();
  const dispatch = useDispatch();
  setUserReduxData(dispatch);
  const [state, action, pending] = useActionState(Logout1, undefined);

  useEffect(() => {
    if (state?.success) {
      localStorage.removeItem("UserData");
      router.push("/login");
    }
  }, [state, router]);

  return (
    <div>
      <p>Email:{user.email}</p>
      <p>Role:{user.role}</p>
      <p>Name : {user.name}</p>
      {user.role == "teacher" ? <p>Subject: {user.subject}</p> : null }
      <p>DashBoard</p>
      <form action={action}>
        <Button
          startIcon={<Logout />}
          type="submit"
          variant="contained"
          disabled={pending}
        >
          Logout
        </Button>
      </form>
    </div>
  );
}
