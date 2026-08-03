import { toggleFavoriteAction } from "@/app/actions";
import { IconButton } from "@/components/ui/IconButton";

export function FavoriteButton({
  assetId,
  favorited,
  className = "",
}: {
  assetId: string;
  favorited: boolean;
  className?: string;
}) {
  return (
    <form action={toggleFavoriteAction} className={className}>
      <input type="hidden" name="assetId" value={assetId} />
      <IconButton
        type="submit"
        variant="solid"
        size="sm"
        aria-label={favorited ? "Remover dos favoritos" : "Favoritar"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={favorited ? "var(--sb-flame)" : "none"}
          stroke={favorited ? "var(--sb-flame)" : "currentColor"}
          strokeWidth="1.8"
          className="text-ink/60"
        >
          <path
            d="M12 20s-7-4.35-9.5-8.5C.5 8 2 4.5 5.5 4a5 5 0 0 1 6.5 2 5 5 0 0 1 6.5-2c3.5.5 5 4 3 7.5C19 15.65 12 20 12 20Z"
            strokeLinejoin="round"
          />
        </svg>
      </IconButton>
    </form>
  );
}
