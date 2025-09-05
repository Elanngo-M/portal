import "server-only"
import fs from "fs";
import path from "path";
const USERS_FILE = path.join(process.cwd() + "/src/app/data/","users.json");

export async function filereader() {
    if (!fs.existsSync(USERS_FILE)) return [];
    try{
        const file:any = fs.readFileSync(USERS_FILE);
        const data = JSON.parse(file);
        return data;
    }catch(error){
        console.log("Error reading file ",error);
    }
    return [];
}

export async function filewriter(data :any) { 
    let mydata = await filereader();
    mydata = JSON.stringify([...mydata , data]);
    fs.writeFileSync(USERS_FILE,mydata);
}

export async function useRegisterd(email:any){
    let users = await filereader();
    if (users.some((u: any) => u.email === email)){
        return true;
    }else{
        return false;
    }
}