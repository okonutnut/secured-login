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
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { cookies } from "next/headers";

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
      const { code: hashedCode } = docSnap.data();

      const isMatch = await compareCode(data.code, hashedCode);
      if (isMatch) {
        // If the code matches, delete the document
        await deleteDoc(docSnap.ref);

        // Reset the user's password and other fields
        await updateDoc(userDoc.ref, {
          isLocked: false,
          lockTimestamp: null,
          loginAttempts: 0,
        });

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
    console.log("ChangePassword data:", data);
    const cookieStore = await cookies();
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
    const userData = userSnapshot.docs[0].data();
    await updateDoc(userDoc, {
      password: hashPassword,
    });

    // Save user data in cookies
    cookieStore.set({
      name: "user",
      value: JSON.stringify({
        fullname: userData.fullname,
        id: userDoc.id,
      }),
      httpOnly: true,
      secure: true,
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

export async function SaveUserData(username: string) {
  try {
    const cookieStore = await cookies();
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

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Save user data in cookies
    cookieStore.set({
      name: "user",
      value: JSON.stringify({
        fullname: userData.fullname,
        id: userDoc.id,
      }),
      httpOnly: true,
      secure: true,
    });

    return {
      success: true,
      message: "User data saved successfully",
    };
  } catch (e) {
    console.error("Error in SaveUserData:", e);
    return {
      success: false,
      message: "An error occurred during saving user data",
    };
  }
}
