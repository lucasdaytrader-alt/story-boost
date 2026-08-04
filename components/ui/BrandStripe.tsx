/** Filete de gradiente — assinatura visual de marca no topo de headers claros. */
export function BrandStripe({ className = "" }: { className?: string }) {
  return <div className={`h-[3px] w-full brand-gradient ${className}`} />;
}
