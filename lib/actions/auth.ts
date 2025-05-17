"use server";
import { auth, signIn, signOut } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

// Type definition for AuthCredentials
interface AuthCredentials {
  email: string;
  password: string;
}

export const signInWithCredentials = async (params: AuthCredentials) => {
  const { email, password } = params

  try {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!user.length) {
      return { success: false, error: "User not found" }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return { success: false, error: result.error }
    }

    return { success: true, role: user[0].role }
  } catch (error) {
    console.error("Signin error", error)
    return { success: false, error: "Signin error" }
  }
}

export async function logout() {
  await signOut();
}

export async function getSessionApproval() {
  const session = await auth()
  const userId = session?.user?.id
  console.log(userId, 'userId')

  if (!session?.user?.id) redirect('/')

  const isApproval = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((res) => {
      const role = res[0]?.role
      return role === 'approver_l1' || role === 'approver_l2'
    })

  if (!isApproval) redirect('/')
}

// Helper function to get user role from session
export async function getUserRole() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const user = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  return user[0]?.role || null
}