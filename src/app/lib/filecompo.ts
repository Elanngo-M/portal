import "server-only"
import fs from "fs";
import path from "path";

export async function filereader(role:any) {
    let mfile = null;
    if(role == "student"){
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

export async function filewriter(data :any, role:any) { 
    let mydata = await filereader(role);
    mydata = JSON.stringify([...mydata , data]);
    let mfile = null;
    if(role == "student"){
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