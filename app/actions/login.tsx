"use server";

import { collection, setDoc, getDocs, query, where } from "firebase/firestore";
import { AuditLogsType, LoginCredentials } from "@/types/credentials";
import { firebasedb } from "@/lib/firebase";
import { compareCode } from "@/lib/hash";
import { cookies } from "next/headers";
import { setAuditLog } from "./audit";
import { decrypt, encrypt } from "@/lib/encrypt";

export async function LoginAction({ username, password }: LoginCredentials) {
  try {
    let isAdmin = false;
    const cookieStore = await cookies();
    const log: AuditLogsType = {
      id: "",
      userId: "",
      username: username,
      ipAddress: "",
      action: "Login",
      status: "",
      timestamp: new Date(),
    };

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

    log.userId = doc.id;
    isAdmin = user.role == "admin" ? true : false;

    const match = await compareCode(password, user.password);
    if (!match && isAdmin) {
      return {
        success: false,
        message: "Wrong password",
      };
    }

    if (user.isLocked && !isAdmin) {
      const lockDuration = 15 * 60 * 1000; // 15 minutes
      const currentTime = new Date().getTime();
      const lockTimestamp = user.lockTimestamp
        ? user.lockTimestamp.toDate().getTime()
        : 0;
      if (currentTime - lockTimestamp < lockDuration) {
        log.status = "failed";
        await setAuditLog(log);
        return {
          success: false,
          message: "Account is locked. Try again later.",
        };
      } else {
        // Unlock the account after the lock duration
        await setDoc(doc.ref, {
          ...user,
          isLocked: false,
          loginAttempts: 0,
          lockTimestamp: null,
        });
      }
    }

    if (!match && !isAdmin) {
      // Increment login attempts and check if user is locked
      const loginAttempts = user.loginAttempts + 1;
      const isLocked = loginAttempts >= 5; // Lock after 3 failed attempts
      const lockTimestamp = isLocked ? new Date() : null;
      await setDoc(doc.ref, {
        ...user,
        loginAttempts: loginAttempts,
        isLocked: isLocked,
        lockTimestamp: lockTimestamp,
      });
      log.status = "failed";
      await setAuditLog(log);
      return {
        success: false,
        message: "Wrong password",
      };
    }

    // After successful login, reset login attempts
    await setDoc(doc.ref, {
      ...user,
      loginAttempts: 0,
      isLocked: false,
      lockTimestamp: null,
    });

    cookieStore.set({
      name: "user",
      value: await encrypt(
        JSON.stringify({
          fullname: user.fullname,
          role: user.role,
          id: doc.id,
        })
      ),
      httpOnly: true,
      secure: true,
    });

    log.status = "success";
    await setAuditLog(log);
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
    return JSON.parse(await decrypt(user.value));
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
