import { ArrowDown, ArrowUp } from "@carbon/icons-react";
import { ValidationComparison } from "../../../types/algorithm.model";

export const ComparisonIcon = ({
  comparison,
}: {
  comparison?: ValidationComparison;
}) => {
  if (!comparison || comparison === "equal") return null;
  return (
    <div className="flex flex-row items-center justify-center absolute h-full w-full text-white/50 left-7">
      {comparison === "greater" && <ArrowUp size={16} />}
      {comparison === "less" && <ArrowDown size={16} />}
    </div>
  );
};
