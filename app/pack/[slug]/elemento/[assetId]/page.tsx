import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAssetWithPackContext, getPackBySlug, getProductBySlug, hasPackAccess } from "@/lib/boost-engine/services/content";
import { getCurrentUser } from "@/lib/boost-engine/services/users";
import { FavoriteButton } from "@/components/story-boost/FavoriteButton";
import { UseInStoryButton } from "@/components/story-boost/UseInStoryButton";
import { ShareIconButton } from "@/components/story-boost/ShareIconButton";
import { IconButton } from "@/components/ui/IconButton";
import { BrandStripe } from "@/components/ui/BrandStripe";

// Página autenticada com dados por usuário — nunca deve ser prerenderizada
// estaticamente no build (precisa da sessão/cookie de cada request).
export const dynamic = "force-dynamic";

export default async function ElementPreviewPage({
  params,
}: {
  params: Promise<{ slug: string; assetId: string }>;
}) {
  const { slug, assetId } = await params;

  const user = await getCurrentUser();

  const product = await getProductBySlug("story-boost");
  if (!product) return null;

  const pack = await getPackBySlug(product.id, slug);
  if (!pack) notFound();

  const access = await hasPackAccess(user.id, pack);
  if (!access) redirect(`/pack/${slug}`);

  const asset = await getAssetWithPackContext(assetId, user.id);
  if (!asset) notFound();

  const favorited = asset.isFavorited > 0;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-ink/95">
      <BrandStripe />
      <div className="flex items-center justify-between px-4 py-3">
        <IconButton href={`/pack/${slug}`} variant="dark" aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </IconButton>
        <FavoriteButton assetId={asset.id} favorited={favorited} />
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-4">
        <div className="shadow-elevation-3 w-full overflow-hidden rounded-3xl">
          <img src={asset.previewUrl} alt={asset.name} className="w-full object-cover" />
        </div>
      </div>

      <div className="shadow-elevation-3 rounded-t-3xl bg-paper px-5 pb-8 pt-3">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" aria-hidden />
        <p className="font-display text-[17px] font-bold text-ink">{asset.name}</p>
        {asset.pack && (
          <Link
            href={`/pack/${slug}`}
            className="focus-ring rounded text-[13px] text-muted underline-offset-2 hover:underline"
          >
            {asset.pack.name}
          </Link>
        )}

        <div className="mt-4">
          <UseInStoryButton assetId={asset.id} assetName={asset.name} imageUrl={asset.previewUrl} full />
        </div>

        <div className="mt-3 flex justify-center gap-4">
          <ShareIconButton assetName={asset.name} imageUrl={asset.previewUrl} />
          <IconButton
            href={asset.previewUrl}
            download={`${asset.name}.jpg`}
            variant="outline"
            size="lg"
            aria-label="Baixar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
        </div>
      </div>
    </div>
  );
}
