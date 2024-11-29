"use client";
import "./Button.css";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant: "add" | "update" | "delete";
  disabled?: boolean;
}

export default function Button({
  onClick,
  children,
  variant,
  disabled,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`button ${variant}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
