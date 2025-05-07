"use client";

import FormInput from "@/components/form-input";
import Logo from "@/components/logo";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RecoveryAction } from "../actions/recovery";
import { AccountRecoveryCredentials } from "@/types/credentials";
import ErrorAlert from "@/components/error-alert";
import ChangePasswordModal from "./change-pass-modal";

export default function RegisterPage() {
  const [username, setUsername] = useState<string>("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [msg, setMsg] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const form = useForm();

  // FORM SUBMIT
  async function onSubmit(data: unknown) {
    if (typeof data === "object" && data !== null && "username" in data) {
      setUsername(data.username as string);
    }
    setState("loading");
    console.log("Form data:", data);
    const res = await RecoveryAction(data as AccountRecoveryCredentials);
    if (res.success == true) {
      setState("idle");
      setOpenModal(true);
    } else {
      setState("error");
      setMsg(res.message);
      console.log("Error:", res.message);
    }
  }
  return (
    <>
      {state === "error" && <ErrorAlert message={msg} />}
      <ChangePasswordModal isOpen={openModal} username={username} />
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
                Account Recovery
              </p>
              <FormInput
                label="Username"
                placeholder="Type here..."
                name="username"
                form={form}
              />
              <FormInput
                label="Recovery Code"
                placeholder="Type here..."
                name="code"
                form={form}
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="btn bg-orange-400 text-white uppercase w-full"
              >
                {state === "loading" ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Submit"
                )}
              </button>
              <Link href={"/"} className="btn-link w-full">
                <button className="btn btn-outline uppercase w-full">
                  Back
                </button>
              </Link>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
