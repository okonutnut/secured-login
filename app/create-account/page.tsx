"use client";

import FormInput from "@/components/form-input";
import Logo from "@/components/logo";
import NonFormInput from "@/components/nonform-input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { checkUsernameExists, createAccountAction } from "../actions/register";
import { RegisterCredentials } from "@/types/credentials";
import WordPhraseModal from "./word-phrase-modal";
import { generateRecoveryCodes } from "@/lib/recovery-codes";
import AlertMessage from "@/components/alert";
import { passwordPolicy } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [isValid, setIsValid] = useState(false);
  const [isExist, setIsExist] = useState<{ error: boolean; msg: string }>();
  const [passMsg, setPassMsg] = useState("");
  const [confPass, setConfPass] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [codes, setCodes] = useState<string[]>([]);

  // Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function fetchCodes() {
      const generatedCodes = await generateRecoveryCodes();
      setCodes(generatedCodes);
    }
    fetchCodes();
  }, []);

  const form = useForm();

  // FORM SUBMIT
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: any) {
    setState("loading");

    const res = await createAccountAction({
      ...data,
      recoveryCodes: codes,
    } as RegisterCredentials);

    if (res) {
      setState("idle");
      setOpenModal(true);
    } else {
      setState("error");
    }
  }

  // CHECK USERNAME AVAILABILITY
  async function checkUsername(username: string) {
    if (username.length === 0) {
      setIsExist({ error: true, msg: "Username is required" });
      return;
    }
    await checkUsernameExists(username).then((res) => {
      console.log(res, "res check username");
      if (res) {
        setIsExist({ error: true, msg: "Username already exists" });
      } else {
        setIsExist({ error: false, msg: "" });
      }
    });
    return;
  }

  return (
    <>
      {state == "error" && (
        <AlertMessage type="error" message="Error on creating your account." />
      )}
      <WordPhraseModal
        codes={codes}
        isOpen={openModal}
        onClose={() => router.push("/login")}
      />
      <section className="h-screen w-screen flex justify-center items-center">
        <div className="card w-[500px] bg-base-100 card-xl shadow-lg">
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
                Sign Up
              </p>
              <FormInput
                label="Fullname"
                placeholder="Type here..."
                name="fullname"
                form={form}
              />
              <FormInput
                label="Username"
                placeholder="Type here..."
                name="username"
                optional={isExist?.msg}
                form={form}
                onChange={(e) => {
                  checkUsername(e.target.value);
                }}
              />
              <FormInput
                label="Password"
                placeholder="Type here..."
                type={showPassword ? "text" : "password"}
                name="password"
                optional={passMsg}
                form={form}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length < 8 && !passwordPolicy.test(value)) {
                    setIsValid(false);
                    setPassMsg(
                      "Must be 8+ chars w/ uppercase, lowercase, number & symbol."
                    );
                  } else {
                    setPassMsg("");
                  }
                }}
                join={
                  <button
                    type="button"
                    className="w-[70px] btn text-xs join-item"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                }
              />
              <NonFormInput
                label="Confirm Password"
                placeholder="Type here..."
                type={showConfirmPassword ? "text" : "password"}
                optional={confPass}
                onChange={(e) => {
                  if (e.target.value != form.getValues("password")) {
                    setIsValid(false);
                    setConfPass("Password do not match");
                  } else {
                    setConfPass("");
                    setIsValid(true);
                    setState("idle");
                  }
                }}
                join={
                  <button
                    type="button"
                    className="w-[70px] btn text-xs join-item"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                }
              />
              <button
                type="submit"
                disabled={state === "loading" || !isValid || isExist?.error}
                className="btn bg-orange-400 text-white uppercase w-full mt-4"
              >
                {state === "loading" ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Create Account"
                )}
              </button>
              <span className="text-xs mt-2">
                Already have an account?{" "}
                <Link href={"/login"} className="btn-link">
                  Sign in
                </Link>
              </span>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
