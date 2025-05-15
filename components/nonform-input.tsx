type NonFormInputProps = {
  placeholder: string;
  optional?: string;
  label: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  join?: React.ReactNode;
};
export default function NonFormInput({
  placeholder,
  optional,
  label,
  type,
  onChange,
  join,
}: NonFormInputProps) {
  return (
    <fieldset className="fieldset w-full m-0 p-0">
      <legend className="fieldset-legend">{label}</legend>
      <div className="join">
        <input
          type={type || "text"}
          className="input w-full"
          placeholder={placeholder}
          onChange={onChange}
        />
        {join}
      </div>
      <p className="label text-red-400">{optional}</p>
    </fieldset>
  );
}
