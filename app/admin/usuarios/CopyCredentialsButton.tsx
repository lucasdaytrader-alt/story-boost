"use client";

import { useState } from "react";

export function CopyCredentialsButton({ email, password }: { email: string; password: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = `E-mail: ${email}\nSenha: ${password}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-mist"
    >
      {copied ? "Copiado!" : "Copiar credenciais"}
    </button>
  );
}
