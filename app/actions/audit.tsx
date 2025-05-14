"use server";

import { AuditLogsType, RegisteredUserType } from "@/types/credentials";
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { firebasedb } from "@/lib/firebase";
import { headers } from "next/headers";

export async function setAuditLog(data: AuditLogsType) {
  try {
    // Get Device IP
    const headerList = await headers();
    const xxf = headerList.get("x-forwarded-for");
    const ip = xxf ? xxf.split(",")[0]?.trim() : "Unknown";

    data.ipAddress = ip == "::1" ? "127.0.0.1" : ip;
    data.timestamp = new Date();

    const logsRef = collection(firebasedb, "auditLogs");
    await setDoc(doc(logsRef), data);
    return {
      success: true,
      message: "Audit log created successfully",
    };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return {
      success: false,
      message: "Error fetching audit logs",
    };
  }
}

export async function getAllAuditLogs() {
  try {
    const logsRef = collection(firebasedb, "auditLogs");
    const snapshot = await getDocs(logsRef);
    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().toString(),
    })) as AuditLogsType[];

    return {
      success: true,
      data: logs,
    };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return {
      success: false,
      message: "Error fetching audit logs",
    };
  }
}

export async function getAllRegisteredUsers() {
  try {
    const usersRef = collection(firebasedb, "users");
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RegisteredUserType[];

    return {
      success: true,
      data: JSON.stringify(users.filter((user) => user.role !== "admin")),
    };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return {
      success: false,
      message: "Error fetching audit logs",
    };
  }
}

export async function lockUserAccount(userId: string) {
  try {
    const userRef = doc(firebasedb, "users", userId);
    await setDoc(
      userRef,
      { isLocked: true, lockTimestamp: new Date() },
      { merge: true }
    );

    // Get user data
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data() as RegisteredUserType;

    // Log the action in the audit log
    await setAuditLog({
      userId,
      username: userData.username,
      action: "LOCK_ACCOUNT",
      status: "SUCCESS",
      timestamp: new Date(),
    });

    return {
      success: true,
      message: "User account locked successfully",
    };
  } catch (error) {
    console.error("Error locking user account:", error);
    return {
      success: false,
      message: "Error locking user account",
    };
  }
}

export async function unlockUserAccount(userId: string) {
  try {
    const userRef = doc(firebasedb, "users", userId);
    await setDoc(
      userRef,
      { isLocked: false, lockTimestamp: null },
      { merge: true }
    );

    // Get user data
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data() as RegisteredUserType;

    // Log the action in the audit log
    await setAuditLog({
      userId,
      username: userData.username,
      action: "UNLOCK_ACCOUNT",
      status: "SUCCESS",
      timestamp: new Date(),
    });

    return {
      success: true,
      message: "User account unlocked successfully",
    };
  } catch (error) {
    console.error("Error unlocking user account:", error);
    return {
      success: false,
      message: "Error unlocking user account",
    };
  }
}
