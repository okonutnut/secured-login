"use server";

import { collection, getDocs, query, where } from "firebase/firestore";
import { LoginCredentials } from "@/types/credentials";
import { firebasedb } from "@/lib/firebase";
import { compareCode } from "@/lib/hash";

export async function LoginAction({ username, password }: LoginCredentials) {
  try {
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
