import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export function Button(props: ButtonProps) {
  const { className, ...rest } = props;
  return (
    <button
      className={`${className} flex items-center justify-center h-12 font-medium text-white bg-purple-500 border-0 rounded-lg cursor-pointer px-8 hover:transition-opacity hover:opacity-9`}
      {...rest}
    />
  );
}
