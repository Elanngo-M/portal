import "server-only"
import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers';
const secretKey = process.env.Session_Secret;
const encodedKey = new TextEncoder().encode(secretKey);


type SessionPayload = {
    userId: string;
    role: string;
    expiresAt: Date;
  }

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
  .setProtectedHeader({alg:"HS256"})
  .setIssuedAt()
  .setExpirationTime("7d")
  .sign(encodedKey)
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, { algorithms: ["HS256"] });
    return payload;
  } catch (error) {
    console.error("Failed to verify session", error);
    return null;
  }
}


export async function createSession(userId: string , role:string){
const expiresAt = new Date(Date.now() + 2 * 60 * 1000)
  const session = await encrypt({ userId,role , expiresAt })
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}