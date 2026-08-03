"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./Button";

/** Button de submit dentro de um <form action=...>, com estado de loading automático via useFormStatus. */
export function FormSubmitButton({
  pendingLabel,
  children,
  variant,
  size,
  fullWidth,
  className,
  ...props
}: {
  pendingLabel?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      type="submit"
      loading={pending}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
    >
      {pending ? (pendingLabel ?? "Aguarde...") : children}
    </Button>
  );
}
