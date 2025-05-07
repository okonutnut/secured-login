"use client";

import FormInput from "@/components/form-input";
import Logo from "@/components/logo";
import NonFormInput from "@/components/nonform-input";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { checkUsernameExists, createAccountAction } from "../actions/register";
import { RegisterCredentials } from "@/types/credentials";
import WordPhraseModal from "./word-phrase-modal";
import ErrorAlert from "@/components/error-alert";
import { generateRecoveryCodes } from "@/lib/recovery-codes";

export default function RegisterPage() {
  const router = useRouter();

  const [isError, setIsError] = useState(false);
  const [isExist, setIsExist] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [confPass, setConfPass] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [codes, setCodes] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCodes() {
      const generatedCodes = await generateRecoveryCodes();
      setCodes(generatedCodes);
    }
    fetchCodes();
  }, []);

  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const form = useForm();

  // FORM SUBMIT
  async function onSubmit(data: unknown) {
    if (submitBtnRef.current) {
      submitBtnRef.current.disabled = true;
    }

    const res = await createAccountAction({
      ...data,
      recoveryCodes: codes,
    } as RegisterCredentials);
    console.log(res, "res");

    if (res) {
      if (submitBtnRef.current) {
        submitBtnRef.current.disabled = true;
      }
      setIsError(false);
      setOpenModal(true);
    } else {
      if (submitBtnRef.current) {
        submitBtnRef.current.disabled = false;
      }
      setIsError(true);
    }
  }

  // CHECK USERNAME AVAILABILITY
  async function checkUsername(username: string) {
    if (username.length === 0) {
      setIsExist("");
    }
    await checkUsernameExists(username).then((res) => {
      console.log(res, "res check username");
      if (res) {
        if (submitBtnRef.current) {
          submitBtnRef.current.disabled = true;
        }
        setIsExist("Username already exists");
      } else {
        if (submitBtnRef.current) {
          submitBtnRef.current.disabled = false;
        }
        setIsExist("Username is available");
      }
    });
  }
  return (
    <>
      {isError && <ErrorAlert message="Error on creating your account." />}
      <WordPhraseModal
        codes={codes}
        isOpen={openModal}
        onClose={() => router.push("/login")}
      />
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
                optional={isExist}
                form={form}
                onChange={(e) => {
                  checkUsername(e.target.value);
                }}
              />
              <FormInput
                label="Password"
                placeholder="Type here..."
                type="password"
                name="password"
                optional={passMsg}
                form={form}
                onChange={(e) => {
                  const password = e.target.value;
                  if (password.length < 8) {
                    setPassMsg("Must be at least 8 characters");
                  } else if (!/[A-Z]/.test(password)) {
                    setPassMsg("Must include at least one uppercase letter");
                  } else if (!/[a-z]/.test(password)) {
                    setPassMsg("Must include at least one lowercase letter");
                  } else if (!/\d/.test(password)) {
                    setPassMsg("Must include at least one number");
                  } else if (!/[@$!%*?&]/.test(password)) {
                    setPassMsg("Must include at least one special character");
                  } else {
                    setPassMsg("");
                  }
                }}
              />
              <NonFormInput
                label="Confirm Password"
                placeholder="Type here..."
                type="password"
                onChange={(e) => {
                  if (e.target.value != form.getValues("password")) {
                    setConfPass("Password do not match");
                  } else {
                    setConfPass("");
                    if (submitBtnRef.current) {
                      submitBtnRef.current.disabled = false;
                    }
                  }
                }}
                optional={confPass}
              />
              <button
                type="submit"
                disabled={true}
                ref={submitBtnRef}
                className="btn bg-orange-400 text-white uppercase w-full"
              >
                Create
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
