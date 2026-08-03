"use client";

import { IconButton } from "@/components/ui/IconButton";

export function ShareIconButton({ assetName, imageUrl }: { assetName: string; imageUrl: string }) {
  async function handleClick() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: assetName, url: imageUrl });
        return;
      } catch {
        // usuário cancelou ou navegador recusou — sem ação adicional
      }
    }
  }

  return (
    <IconButton onClick={handleClick} variant="outline" size="lg" aria-label="Compartilhar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 10.5 15.4 6.5M8.6 13.5 15.4 17.5" strokeLinecap="round" />
      </svg>
    </IconButton>
  );
}
