import { cn } from "../../../../../utils/cn";

type ProductGraphLoadingProps = {
  className?: string;
  totalBoxes?: number;
  boxesClassName?: string;
};
function TableLoading({
  className,
  boxesClassName,
  totalBoxes,
}: ProductGraphLoadingProps) {
  return (
    <div
      className={cn(
        "grid gap-1.5 grid-cols-4 p-2 border border-zinc-200 rounded-sm",
        className
      )}
    >
      {new Array(totalBoxes || 3).fill(0).map((_, index) => (
        <div
          key={index}
          className={cn(
            "bg-zinc-300 w-full border border-zinc-300 rounded-md p-2 space-y-2 relative animate-pulse min-h-16",
            boxesClassName
          )}
        ></div>
      ))}
    </div>
  );
}

export default TableLoading;
