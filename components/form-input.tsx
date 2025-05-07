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
}: FormInputProps) {
  return (
    <fieldset className="fieldset w-full m-0 p-0">
      <legend className="fieldset-legend">{label}</legend>
      <input
        type={type || "text"}
        className="input"
        placeholder={placeholder}
        {...form.register(name, { required: required })}
        onChange={onChange}
        required
      />
      <pre className="label text-red-400">{optional}</pre>
    </fieldset>
  );
}
