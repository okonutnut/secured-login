import { useState } from "react";
import { lockUserAccount, unlockUserAccount } from "../../actions/audit";
import AlertMessage from "@/components/alert";

type ActionButtonProps = {
  open: boolean;
  onClose?: () => void;
  isLocked: boolean;
  userId: string;
};

export default function ActionButton({
  open,
  onClose,
  isLocked,
  userId,
}: ActionButtonProps) {
  const [isValid, setIsValid] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );

  // Function to handle the action of locking or unlocking the user account
  async function handleAction() {
    try {
      setState("loading");
      const action = isLocked ? unlockUserAccount : lockUserAccount;
      const res = await action(userId);
      setState(res.success ? "success" : "error");
    } catch {
      setState("error");
    } finally {
      window.location.reload();
    }
  }

  return (
    <>
      {state === "error" && (
        <AlertMessage
          type="error"
          message="Error on updating account status."
        />
      )}
      {state === "success" && (
        <AlertMessage
          type="success"
          message="Successfully updated account status."
        />
      )}
      <dialog open={open} onClose={onClose} className="modal">
        <div className="modal-box text-start">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            You want to {isLocked ? "unlock" : "lock"} this account?
          </h3>
          <p className="py-4 text-center">
            Type <strong className="text-accent">CONFIRM</strong> to continue.
          </p>
          <input
            type="text"
            placeholder="Type here"
            className="input w-full"
            onChange={(e) => {
              setIsValid(e.target.value === "CONFIRM" ? true : false);
            }}
          />
          <button
            onClick={() => handleAction()}
            disabled={!isValid}
            className="btn btn-outline mt-4 w-full"
          >
            {state === "loading" ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <span>{isLocked ? "Unlock Account" : "Lock Account"}</span>
            )}
          </button>
        </div>
      </dialog>
    </>
  );
}
