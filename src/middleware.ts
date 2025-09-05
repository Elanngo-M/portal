import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/","/login/student","/login/teacher","/signup"]
const nonexistantRoutes = ["/login"]

export default async function middleware(req:NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const isProtectedRoute = protectedRoutes.includes(path);
    const isNonExistantRoute = nonexistantRoutes.includes(path);
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    if((isPublicRoute || isNonExistantRoute) && session?.userId){
        return NextResponse.redirect(new URL("/dashboard",req.nextUrl));
    }
    if((isProtectedRoute || isNonExistantRoute) && !session?.userId){
        return NextResponse.redirect(new URL("/",req.nextUrl));
    }

    return NextResponse.next();
}