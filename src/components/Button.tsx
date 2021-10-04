import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  return (
    <button
      className={
        "flex items-center justify-center h-12 font-medium text-white bg-purple-500 border-0 rounded-lg cursor-pointer px-8 hover:transition-opacity hover:oacity-90"
      }
      {...props}
    />
  );
}
