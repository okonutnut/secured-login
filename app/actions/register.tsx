"use server";

import { collection, setDoc, getDocs, doc, addDoc } from "firebase/firestore";
import { AuditLogsType, RegisterCredentials } from "@/types/credentials";
import { firebasedb } from "@/lib/firebase";
import { hashCode } from "@/lib/hash";
import { cookies } from "next/headers";
import { setAuditLog } from "./audit";

export async function createAccountAction({
  fullname,
  username,
  password,
  recoveryCodes,
}: RegisterCredentials): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const log: AuditLogsType = {
      userId: "",
      username: username,
      ipAddress: "",
      action: "register",
      status: "",
      timestamp: new Date(),
    };
    // Save User to Firestore
    const docRef = await doc(collection(firebasedb, "users"));
    const generatedId = docRef.id;
    log.userId = generatedId;

    const userObject = {
      id: generatedId,
      fullname: fullname,
      username: username,
      password: await hashCode(password),
      role: "user",
      loginAttempts: 0,
      isLocked: false,
      lockTimestamp: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setDoc(docRef, {
      ...userObject,
    });

    // Save Recovery Codes to Firestore with the same ID as the user
    const recoveryCodesRef = collection(
      firebasedb,
      "users",
      docRef.id,
      "recoveryCodes"
    );

    // Hash the recovery codes before saving them
    const hashedCodes = await Promise.all(
      recoveryCodes.map((code) => hashCode(code))
    );
    const recoveryCodesPromises = hashedCodes.map((code) =>
      addDoc(recoveryCodesRef, { code })
    );
    await Promise.all(recoveryCodesPromises);

    // Save the user object to cookies
    cookieStore.set({
      name: "user",
      value: JSON.stringify(userObject),
      httpOnly: true,
      secure: true,
    });
    log.status = "success";
    await setAuditLog(log);
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
}

export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    const usersRef = collection(firebasedb, "users");
    const querySnapshot = await getDocs(usersRef);
    const usernameExists = querySnapshot.docs.some(
      (doc) => doc.data().username === username
    );

    return usernameExists;
  } catch (error) {
    console.error("Error checking username existence: ", error);
    return false;
  }
}
