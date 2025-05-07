"use server";

import { collection, addDoc, getDocs } from "firebase/firestore";
import { RegisterCredentials } from "@/types/credentials";
import { firebasedb } from "@/lib/firebase";
import { hashCode } from "@/lib/hash";

export async function createAccountAction({
  fullname,
  username,
  password,
  recoveryCodes,
}: RegisterCredentials): Promise<boolean> {
  try {
    // Save User to Firestore
    const docRef = await addDoc(collection(firebasedb, "users"), {
      fullname: fullname,
      username: username,
      password: await hashCode(password), // Hash the password before saving it
    });
    console.log("Document written with ID: ", docRef.id);

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
    console.log("Recovery codes added successfully");

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
