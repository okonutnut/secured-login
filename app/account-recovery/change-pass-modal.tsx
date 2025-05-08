import FormInput from "@/components/form-input";
import NonFormInput from "@/components/nonform-input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ChangePassword, SaveUserData } from "../actions/recovery";
import { useRouter } from "next/navigation";
import { LoginCredentials } from "@/types/credentials";
import ErrorAlert from "@/components/error-alert";

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
  const router = useRouter();
  const form = useForm();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [confPass, setConfPass] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: any) {
    setState("loading");

    const password = data.password as string;
    const res = await ChangePassword({
      password: password,
      username: username,
    } as LoginCredentials);

    if (res.success === true) {
      setState("idle");
      router.push("/home");
    } else {
      setState("error");
      setErrorMsg(res.message);
    }
  }

  async function skipChangePass() {
    setState("loading");
    await SaveUserData(username);
    setState("idle");
    router.push("/home");
  }
  return (
    <>
      {state === "error" && <ErrorAlert message={errorMsg} />}
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
          <button
            onClick={() => skipChangePass()}
            className="btn btn-outline uppercase w-full"
          >
            Skip
          </button>
        </div>
      </dialog>
    </>
  );
}
