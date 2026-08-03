"use client";

import { useState } from "react";
import { recordUseInStoryAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";

export function UseInStoryButton({
  assetId,
  assetName,
  imageUrl,
  full = false,
}: {
  assetId: string;
  assetName: string;
  imageUrl: string;
  full?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "sharing" | "done">("idle");

  async function handleClick() {
    setStatus("sharing");
    try {
      await recordUseInStoryAction(assetId);

      // Fluxo principal (ADR-002): Web Share API — abre o menu nativo do
      // sistema, de onde o Instagram Stories aparece como destino.
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], `${assetName}.jpg`, { type: blob.type });

          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title: assetName });
            setStatus("done");
            return;
          }
        } catch {
          // segue para o fallback abaixo
        }
      }

      // Fallback (navegador sem suporte a Web Share API com arquivos, ex:
      // desktop): baixa a imagem para o usuário importar manualmente.
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${assetName}.jpg`;
      link.click();
      setStatus("done");
    } finally {
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  return (
    <Button
      onClick={handleClick}
      loading={status === "sharing"}
      fullWidth
      size={full ? "lg" : "sm"}
      className={full ? "text-[15px]" : "text-[13px]"}
    >
      {status === "sharing" ? "Preparando..." : status === "done" ? "Pronto ✓" : full ? "Usar no Story ✨" : "Usar no Story"}
    </Button>
  );
}
