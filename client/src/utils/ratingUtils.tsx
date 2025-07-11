
import { Badge } from "@/components/ui/badge";
import { SAIL_DESIGN_SYSTEM } from "@/config/sailDesignSystem";

export const getRatingColor = (rating: string): string => {
  const numRating = parseFloat(rating);
  if (numRating >= 4.0) return SAIL_DESIGN_SYSTEM.components.badge.rating.high;
  if (numRating >= 3.0) return SAIL_DESIGN_SYSTEM.components.badge.rating.medium;
  if (numRating >= 2.0) return SAIL_DESIGN_SYSTEM.components.badge.rating.low;
  return SAIL_DESIGN_SYSTEM.components.badge.rating.none;
};

export const RatingBadge = ({ value, color }: { value: string; color?: string }) => {
  if (value === "N/A") {
    return (
      <Badge className={`rounded-md px-2.5 py-1 font-bold ${SAIL_DESIGN_SYSTEM.components.badge.rating.none} min-w-[48px] text-center`}>
        N/A
      </Badge>
    );
  }

  const numValue = parseFloat(value);
  const formattedValue = numValue.toFixed(1);
  const badgeColor = color || getRatingColor(value);
  
  return (
    <Badge className={`rounded-md px-2.5 py-1 font-bold ${badgeColor} min-w-[48px] text-center`}>
      {formattedValue}
    </Badge>
  );
};
