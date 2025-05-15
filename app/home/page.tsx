"use client";

import Logo from "@/components/logo";
import { GetCurrentUserHook } from "./hooks";
import { LogoutAction } from "../actions/login";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const user = GetCurrentUserHook();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function Logout() {
    setState("loading");
    const res = await LogoutAction();
    if (res?.success) {
      setState("idle");
      router.push("/login");
    } else {
      setState("error");
      alert(res?.message);
    }
  }
  return (
    <>
      <section className="h-screen w-screen flex justify-center items-center">
        <div className="card w-96 bg-base-100 card-xl shadow-lg">
          <div className="card-body">
            <span className="card-title mx-auto">
              <Logo />
            </span>
            <p className="mx-auto font-medium uppercase text-sm text-center">
              Shop for the best used clothes.
            </p>
            <p className="font-medium text-center mt-4">
              Hello, <strong>{user?.fullname}</strong>
            </p>
            {user?.role === "admin" && (
              <>
                <button
                  className="btn btn-outline uppercase w-full mt-4"
                  onClick={() => router.push("/admin/audit-logs")}
                >
                  Audit Logs
                </button>
                <button
                  className="btn btn-outline uppercase w-full"
                  onClick={() => router.push("/admin/manage-users")}
                >
                  Manage Users
                </button>
              </>
            )}
            <button
              disabled={state === "loading"}
              className="btn btn-accent uppercase w-full mt-4 text-white"
              onClick={() => Logout()}
            >
              {state === "loading" ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
