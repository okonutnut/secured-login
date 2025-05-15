"use client";

import { useRouter } from "next/navigation";
import { GetAllAuditLogsHook } from "./hooks";

export default function AuditLogPage() {
  const router = useRouter();
  const data = GetAllAuditLogsHook();
  return (
    <>
      <section className="h-screen w-screen">
        <div className="container p-4 mx-auto">
          <div className="flex justify-between items-center w-full">
            <div className="text-2xl uppercase font-bold">Audit Logs</div>
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
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Action</th>
                  <th>Status</th>
                  <th className="text-end">Date</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data?.map((log, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{log.userId}</td>
                      <td>{log.username}</td>
                      <td>{log.action.toUpperCase()}</td>
                      <td>
                        <div className="badge badge-accent rounded-full text-white">
                          {log.status.toUpperCase()}
                        </div>
                      </td>
                      <td className="text-end">
                        {new Date(log.timestamp).toLocaleString()}
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
