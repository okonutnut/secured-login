"use client";

import FormInput from "@/components/form-input";
import Logo from "@/components/logo";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginAction } from "../actions/login";
import { LoginCredentials } from "@/types/credentials";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const form = useForm();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(data: unknown) {
    console.log(data);
    setState("loading");

    const res = await LoginAction(data as LoginCredentials);
    console.log(res);
    if (res?.success) {
      // Redirect to the home page
      setState("idle");
      router.push("/home");
    } else {
      setState("error");
      setMsg(res?.message as string);
    }
  }
  return (
    <>
      {state === "error" && (
        <div className="alert alert-error shadow-lg absolute top-0 left-0 w-full z-50">
          <div>
            <span>{msg}</span>
          </div>
        </div>
      )}
      <section className="h-screen w-screen flex justify-center items-center">
        <div className="card w-96 bg-base-100 card-xl shadow-lg">
          <div className="card-body">
            <span className="card-title mx-auto">
              <Logo />
            </span>
            <p className="mx-auto font-medium uppercase text-sm text-center">
              Shop for the best used clothes.
            </p>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-col justify-center items-center card-actions gap-1 pt-10"
            >
              <p className="mx-auto text-xl font-bold uppercase text-center">
                Sign in
              </p>
              <FormInput
                label="Username"
                placeholder="Type here..."
                name="username"
                type="text"
                form={form}
              />
              <FormInput
                label="Password"
                placeholder="Type here..."
                name="password"
                type="password"
                form={form}
              />
              <button
                disabled={state === "loading"}
                type="submit"
                className="btn bg-orange-400 text-white uppercase w-full"
              >
                {state === "loading" ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Login"
                )}
              </button>
              <span className="text-xs mt-2">
                No account?{" "}
                <Link href={"/create-account"} className="btn-link">
                  Sign Up
                </Link>
              </span>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
