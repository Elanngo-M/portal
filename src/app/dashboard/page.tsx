"use client";

import { useRouter } from "next/navigation";
import { getUserLocalData } from "../lib/utils";
import Studentboard from "./studentBoard";
import Teacherboard from "./TeacherBoard";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = getUserLocalData();
    if(userData.role == "student"){
      setUser("student")
    }else {
      setUser("teacher")
    }
    }, [router]);

  

  if (!user) {
    return null;
  }

  if (user === "student") {
    return <Studentboard />;
  } else {
    return <Teacherboard />;
  }
}
