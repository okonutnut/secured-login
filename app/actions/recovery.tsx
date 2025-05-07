"use server";

import { firebasedb } from "@/lib/firebase";
import { compareCode, hashCode } from "@/lib/hash";
import {
  AccountRecoveryCredentials,
  LoginCredentials,
} from "@/types/credentials";
import {
  collection,
  query,
  where,
  getDocs,
  setDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export async function RecoveryAction(data: AccountRecoveryCredentials) {
  try {
    const usersRef = collection(firebasedb, "users");
    const q = query(usersRef, where("username", "==", data.username));
    const userSnapshot = await getDocs(q);

    if (userSnapshot.empty) {
      console.log("No matching documents.");
      return {
        success: false,
        message: "User not found",
      };
    }

    const userDoc = userSnapshot.docs[0];

    // Get Recovery Code from the user data
    const recoveryCodesRef = collection(
      firebasedb,
      "users",
      userDoc.id,
      "recoveryCodes"
    );

    const codeSnapshot = await getDocs(recoveryCodesRef);

    for (const docSnap of codeSnapshot.docs) {
      console.log("Checking code:", docSnap.id, docSnap.data());
      const { code: hashedCode } = docSnap.data();

      const isMatch = await compareCode(data.code, hashedCode);
      if (isMatch) {
        // If the code matches, delete the document
        await deleteDoc(docSnap.ref);
        return {
          success: true,
          message: "Recovery code verified successfully",
        };
      }
    }

    return {
      success: false,
      message: "Invalid recovery code",
    };
  } catch (e) {
    console.error("Error in RecoveryAction:", e);
    return {
      success: false,
      message: "An error occurred during recovery",
    };
  }
}

export async function ChangePassword(data: LoginCredentials) {
  try {
    const { username, password } = data;
    const hashPassword = await hashCode(password);

    const usersRef = collection(firebasedb, "users");
    const q = query(usersRef, where("username", "==", username));
    const userSnapshot = await getDocs(q);

    if (userSnapshot.empty) {
      console.log("No matching documents.");
      return {
        success: false,
        message: "User not found",
      };
    }
    const userDoc = userSnapshot.docs[0].ref;
    await updateDoc(userDoc, {
      password: hashPassword,
    });

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (e) {
    console.error("Error in ChangePassword:", e);
    return {
      success: false,
      message: "An error occurred during password change",
    };
  }
}
