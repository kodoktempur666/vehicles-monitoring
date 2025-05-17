"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    return { success: true, role: user[0].role } // ← return role here
  } catch (error) {
    console.error("Signin error", error)
    return { success: false, error: "Signin error" }
  }
}

export async function logout() {
  await signOut();
}