"use client";

import { getUserLocalData } from "../lib/utils";
import Studentboard from "./studentBoard";
import Teacherboard from "./TeacherBoard";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = getUserLocalData();
    if(userData.teacherData){
        setUser(userData.teacherData)
    }else if (userData.data) {
      setUser(userData.data.studentData.data);
    }else{
      setUser(userData.studentData.data);
    }
  }, []);

  

  if (!user) {
    return null;
  }

  if (user?.role === "student") {
    return <Studentboard />;
  } else {
    return <Teacherboard />;
  }
}
