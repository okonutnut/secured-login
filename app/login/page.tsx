"use client";

import FormInput from "@/components/form-input";
import Logo from "@/components/logo";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginAction } from "../actions/login";
import { LoginCredentials } from "@/types/credentials";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "@/components/alert";
import { passwordPolicy } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const form = useForm();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [msg, setMsg] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);

  async function onSubmit(data: unknown) {
    setState("loading");

    const res = await LoginAction(data as LoginCredentials);
    if (res?.success == true) {
      setState("idle");
      router.push("/home");
    } else {
      setState("error");
      setMsg(res?.message as string);
    }
  }
  return (
    <>
      {state === "error" && <AlertMessage type="error" message={msg} />}
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
                required
              />
              <FormInput
                label="Password"
                placeholder="Type here..."
                name="password"
                type={showPassword ? "text" : "password"}
                form={form}
                required
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length < 8 && !passwordPolicy.test(value)) {
                    setIsValid(false);
                  } else {
                    setIsValid(true);
                    setMsg("");
                  }
                }}
                join={
                  <button
                    type="button"
                    className="btn join-item"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    Show
                  </button>
                }
              />
              <button
                disabled={state === "loading" || !isValid}
                type="submit"
                className="btn bg-orange-400 text-white uppercase w-full mt-4"
              >
                {state === "loading" ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Login"
                )}
              </button>
              <span className="text-xs mt-2">
                <Link href={"/account-recovery"} className="btn-link">
                  Forgot password?
                </Link>
              </span>
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
