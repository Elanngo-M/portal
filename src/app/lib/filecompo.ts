import "server-only"
import fs from "fs";
import path from "path";

export async function filereader(role:any , datafile= false ) {
    let mfile = null;
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
    if (!fs.existsSync(mfile)) return [];
    try{
        const file:any = fs.readFileSync(mfile);
        const data = JSON.parse(file);
        return data;
    }catch(error){
        console.log("Error reading file ",error);
    }
    return [];
}

export async function getUserData(email: string, role: string , datafile=false) {
    const users = await filereader(role , datafile);
    console.log(users);
    return users.find((user: any) => user.email === email) || null;
}

export async function filewriter(data :any, role:any , datafile = false) { 
    let mydata = await filereader(role, datafile);
    mydata = JSON.stringify([...mydata , data]);
    let mfile = null;
    if(datafile){
        if(role == "student"){
             mfile = path.join(process.cwd() + "/src/app/data/","students-data.json");
        }else{
            mfile = path.join(process.cwd() + "/src/app/data/","teachers-data.json");
        }
    }
    else if(role == "student"){
        mfile = path.join(process.cwd() + "/src/app/data/","students.json");
    }else{
        mfile = path.join(process.cwd() + "/src/app/data/","teachers.json");
    }
    fs.writeFileSync(mfile,mydata);
}

export async function userRegisterd(email:any , role:any){
    let users = await filereader(role);
    if (users.some((u: any) => u.email === email)){
        return true;
    }else{
        return false;
    }
}

