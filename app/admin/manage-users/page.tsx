"use client";

import { formatFirestoreTimestamp } from "@/lib/utils";
import { GetAllRegisteredUsersHook } from "./hooks";
import ActionButton from "./action-button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuditLogPage() {
  const router = useRouter();
  const data = GetAllRegisteredUsersHook();
  const [open, setOpen] = useState(false);
  return (
    <>
      <section className="h-screen w-screen">
        <div className="container p-4 mx-auto">
          <div className="flex justify-between items-center w-full">
            <div className="text-2xl uppercase font-bold text-accent">
              Manage Users
            </div>
            <button
              className="btn btn-outline"
              onClick={() => router.push("/home")}
            >
              Back
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Username</th>
                  <th>Account Status</th>
                  <th className="text-end">Action</th>
                  <th className="text-end">Date Registered</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data?.map((log, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{log.username}</td>
                      <td>
                        <div className="badge badge-accent rounded-full text-white">
                          {log.isLocked ? "Locked" : "Active"}
                        </div>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-accent text-white"
                          onClick={() => setOpen(true)}
                        >
                          {log.isLocked ? "Unlock Account" : "Lock Account"}
                        </button>
                        {
                          <ActionButton
                            open={open}
                            onClose={() => setOpen(false)}
                            isLocked={log.isLocked}
                            userId={log.id ?? ""}
                          />
                        }
                      </td>
                      <td className="text-end">
                        {formatFirestoreTimestamp(log.createdAt)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
