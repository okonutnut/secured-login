import { UseFormReturn } from "react-hook-form";

type FormInputProps = {
  placeholder: string;
  optional?: string;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  form: UseFormReturn;
  join?: React.ReactNode;
};
export default function FormInput({
  placeholder,
  optional,
  label,
  name,
  type,
  required,
  onChange,
  form,
  join,
}: FormInputProps) {
  return (
    <fieldset className="fieldset w-full m-0 p-0">
      <legend className="fieldset-legend">{label}</legend>
      <div className="join">
        <input
          type={type || "text"}
          className="input w-full"
          placeholder={placeholder}
          {...form.register(name, { required: required })}
          onChange={onChange}
          required
        />
        {join}
      </div>
      <pre className="label text-red-400">{optional}</pre>
    </fieldset>
  );
}
