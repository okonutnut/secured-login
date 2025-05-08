"use server";

import { AuditLogsType } from "@/types/credentials";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { firebasedb } from "@/lib/firebase";
import { headers } from "next/headers";

export async function setAuditLog(data: AuditLogsType) {
  try {
    // Get Device IP
    const headerList = await headers();
    const xxf = headerList.get("x-forwarded-for");
    const ip = xxf ? xxf.split(",")[0]?.trim() : "Unknown";

    data.ipAddress = ip;
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
    const logs: AuditLogsType[] = snapshot.docs.map((doc) => ({
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
