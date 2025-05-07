type NonFormInputProps = {
  placeholder: string;
  optional?: string;
  label: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function NonFormInput({
  placeholder,
  optional,
  label,
  type,
  onChange,
}: NonFormInputProps) {
  return (
    <fieldset className="fieldset w-full m-0 p-0">
      <legend className="fieldset-legend">{label}</legend>
      <input
        type={type || "text"}
        className="input w-full"
        placeholder={placeholder}
        onChange={onChange}
      />
      <p className="label text-red-400">{optional}</p>
    </fieldset>
  );
}
