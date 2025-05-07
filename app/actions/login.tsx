"use server";

import { collection, getDocs, query, where } from "firebase/firestore";
import { LoginCredentials } from "@/types/credentials";
import { firebasedb } from "@/lib/firebase";
import { compareCode } from "@/lib/hash";
import { cookies } from "next/headers";

export async function LoginAction({ username, password }: LoginCredentials) {
  try {
    const cookieStore = await cookies();
    const usersRef = collection(firebasedb, "users");
    const q = query(usersRef, where("username", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No matching documents.");
      return {
        success: false,
        message: "User not found",
      };
    }

    const doc = snapshot.docs[0];
    const user = doc.data();

    const match = await compareCode(password, user.password);
    cookieStore.set({
      name: "user",
      value: JSON.stringify(user),
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "strict",
    });

    if (!match) {
      return {
        success: false,
        message: "Wrong password",
      };
    }
    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
}

export async function LogoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("user");
    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error) {
    console.error("Error logging out:", error);
    return {
      success: false,
      message: "An error occurred during logout",
    };
  }
}

export async function GetCurrentUser() {
  try {
    const cookieStore = await cookies();
    const user = cookieStore.get("user");
    if (!user) {
      return null;
    }
    return JSON.parse(user.value);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
