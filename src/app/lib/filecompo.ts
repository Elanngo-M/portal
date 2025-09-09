import "server-only"
import fs from "fs";
import path from "path";

export async function filereader(role:any , datafile= false ) {
    let mfile = null;
    let sfile = path.join(process.cwd() + "/src/app/data/" + "students-data.json");
    if(datafile){
        if(role== "student"){
            mfile = path.join(process.cwd() + "/src/app/data/" + "students-data.json");
        }else{
            mfile = path.join(process.cwd() + "/src/app/data/" + "teachers-data.json");
        }
    }else if(role == "student" && !datafile){
        mfile = path.join(process.cwd() + "/src/app/data/","students.json");
    }else{
        mfile = path.join(process.cwd() + "/src/app/data/","teachers.json");
    }
    if(!datafile || role == "student"){
        if (!fs.existsSync(mfile)) return [];
        try{
            const file:any = fs.readFileSync(mfile);
            const data = JSON.parse(file);
            return data;
        }catch(error){
            console.log("Error reading file ",error);
        }
    }else{
        if(!fs.existsSync(mfile) ||!fs.existsSync(sfile)) return [];
        try{
            const file1:any = fs.readFileSync(mfile);
            const file2:any = fs.readFileSync(sfile);
            const data1 = JSON.parse(file1);
            const data2 = JSON.parse(file2);
            const data = {teacherData: data1 , studentData:data2}
            return data;
        }catch(error){
            console.log("Error reading file ",error);
        }
    }
    return [];
}

export async function getUserData(email: string, role: string , datafile=false) {
    const users = await filereader(role , datafile);
    if(datafile && role == "teacher"){
        let teacher = users.teacherData.find((user: any) => user.email === email) || null;
        let students = users.studentData;
        let res = {data: {teacherData: teacher , studentData:{students:students}}};
        return res;
    }
    return users.find((user: any) => user.email === email) || null;
}

export async function filewriter(data: any, role: any, datafile = false) {
    let mydata = await filereader(role, datafile);
    let newData;
    if (datafile && role === "teacher") {
        let dat = mydata.teacherData || [];
        newData = JSON.stringify([...dat, data]);
    } else {
        let dat = Array.isArray(mydata) ? mydata : [];
        newData = JSON.stringify([...dat, data]);
    }
    let mfile = null;
    if (datafile) {
        if (role == "student") {
            mfile = path.join(process.cwd() + "/src/app/data/", "students-data.json");
        } else {
            mfile = path.join(process.cwd() + "/src/app/data/", "teachers-data.json");
        }
    }
    else if (role == "student") {
        mfile = path.join(process.cwd() + "/src/app/data/", "students.json");
    } else {
        mfile = path.join(process.cwd() + "/src/app/data/", "teachers.json");
    }
    fs.writeFileSync(mfile, newData);
}

export async function userRegisterd(email:any , role:any){
    let users = await filereader(role);
    if (users.some((u: any) => u.email === email)){
        return true;
    }else{
        return false;
    }
}

export async function writeAssignment(assignment: any) {
    const assignedStudents: string[] = assignment.student;
    let studentData = await filereader("student", true);

    // Add assignment info to each assigned student
    const updatedStudentData = studentData.map((student: any) => {
        if (assignedStudents.includes(student.email)) {
            if (!Array.isArray(student.assignments)) {
                student.assignments = [];
            }
            student.assignments.push({
                name: assignment.name,
            });
        }
        return student;
    });
    const mfile = path.join(process.cwd(), "src/app/data/", "students-data.json");
    fs.writeFileSync(mfile, JSON.stringify(updatedStudentData, null, 2));
}

