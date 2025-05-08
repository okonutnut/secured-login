type WordPhraseModalProps = {
  codes?: string[];
  isOpen: boolean;
  onClose: () => void;
};
export default function WordPhraseModal({
  codes,
  isOpen,
  onClose,
}: WordPhraseModalProps) {
  return (
    <>
      <dialog
        id="word-phrase-modal"
        open={isOpen}
        onClose={onClose}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Your Recovery Codes.</h3>
          <p className="py-4 text-xs">
            Save these somewhere safe. You won&apos;t see them again.
          </p>
          <ul className="text-center">
            {codes?.map((code, index) => (
              <li key={index} className="text-sm font-mono">
                {code}
              </li>
            ))}
          </ul>
          <button
            className="btn btn-sm btn-outline w-full mt-4"
            onClick={() => {
              navigator.clipboard.writeText(codes ? codes.join("\n") : "");
              alert("Recovery codes copied to clipboard.");
            }}
          >
            Copy Codes
          </button>
          <p className="py-4 text-xs">
            You can use these codes to recover your account if you lose access
            to your authentication method.
          </p>
        </div>
      </dialog>
    </>
  );
}
