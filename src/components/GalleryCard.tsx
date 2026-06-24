import { Link } from "react-router-dom";
import type { Piece } from "@/data/pieces";
import { Badge } from "@/components/ui/badge";

interface GalleryCardProps {
  piece: Piece;
  index: number;
}

const purposeColor: Record<string, string> = {
  Functional: "bg-accent text-accent-foreground",
  Decorative: "bg-secondary/20 text-secondary",
  Sculptural: "bg-primary/20 text-primary-foreground",
  Lighting: "bg-muted text-muted-foreground",
};

const GalleryCard = ({ piece, index }: GalleryCardProps) => (
  <Link
    to={`/piece/${piece.id}`}
    className="group block overflow-hidden rounded-lg"
  >
    <div className="aspect-square overflow-hidden rounded-lg bg-muted">
      <img
        src={piece.images[0]}
        alt={piece.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="mt-3 space-y-1.5">
      <h3 className="font-serif text-lg text-foreground">{piece.name}</h3>
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline" className="text-xs font-normal">
          {piece.techniques[0]}
        </Badge>
        <Badge className={`text-xs font-normal border-0 ${purposeColor[piece.purpose]}`}>
          {piece.purpose}
        </Badge>
      </div>
    </div>
  </Link>
);

export default GalleryCard;
