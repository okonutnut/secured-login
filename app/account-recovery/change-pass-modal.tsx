import FormInput from "@/components/form-input";
import NonFormInput from "@/components/nonform-input";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ChangePassword } from "../actions/recovery";
import { ChangePasswordCredentials } from "@/types/credentials";

type ChangePasswordModalProps = {
  username: string;
  isOpen: boolean;
  onClose?: () => void;
};
export default function ChangePasswordModal({
  username,
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [passMsg, setPassMsg] = useState("");
  const [confPass, setConfPass] = useState("");

  const form = useForm();

  async function onSubmit(data: unknown) {
    console.log("Form data:", { ...data, username: username });
  }
  return (
    <>
      <dialog
        id="change-passowrd-modal"
        open={isOpen}
        onClose={onClose}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Successfully Recovered</h3>
          <p className="py-4 text-xs">Do you want to change your password?</p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
                  setState("idle");
                }
              }}
              optional={confPass}
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="btn bg-orange-400 text-white uppercase w-full mt-4"
            >
              {state === "loading" ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
          <p className="py-4 text-xs">Or skip for now</p>
          <Link href={"/"} className="btn-link w-full">
            <button className="btn btn-outline uppercase w-full">Skip</button>
          </Link>
        </div>
      </dialog>
    </>
  );
}
