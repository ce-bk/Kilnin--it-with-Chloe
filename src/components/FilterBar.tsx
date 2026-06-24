import type { Technique, Purpose } from "@/data/pieces";
import { allPurposes } from "@/data/pieces";

interface FilterBarProps {
  selectedTechnique: Technique | null;
  selectedPurpose: Purpose | null;
  onTechniqueChange: (t: Technique | null) => void;
  onPurposeChange: (p: Purpose | null) => void;
}

const FilterBar = ({
  selectedTechnique,
  selectedPurpose,
  onTechniqueChange,
  onPurposeChange,
}: FilterBarProps) => {
  const usedTechniques: Technique[] = [
    "Wheel-thrown", "Hand-built", "Slab-building"
  ];

  return (
    <div className="space-y-4">
      {/* Technique filter */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Technique
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTechniqueChange(null)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              !selectedTechnique
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {usedTechniques.map((t) => (
            <button
              key={t}
              onClick={() => onTechniqueChange(t === selectedTechnique ? null : t)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                selectedTechnique === t
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Purpose filter */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Purpose
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onPurposeChange(null)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              !selectedPurpose
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {allPurposes.map((p) => (
            <button
              key={p}
              onClick={() => onPurposeChange(p === selectedPurpose ? null : p)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                selectedPurpose === p
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
