import {ButtonHTMLAttributes} from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
  return (
    <button className={"flex items-center justify-center w-full h-12 mt-4 font-medium text-white bg-purple-500 border-0 rounded-lg cursor-pointer px-8-center hover:transition-opacity hover:opacity-90"} {...props}/>
  )
}