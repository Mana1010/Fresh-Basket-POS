import { cn } from "../../../../../utils/cn";

type ProductLoadingProps = {
  totalBoxes: number;
  className?: string;
  boxesClassName?: string;
};
function BoxesLoading({
  totalBoxes,
  className,
  boxesClassName,
}: ProductLoadingProps) {
  return (
    <div className={cn("grid grid-cols-4 gap-1.5", className)}>
      {new Array(totalBoxes).fill(null).map((_, i) => (
        <div
          key={i}
          className={cn(
            `custom-border rounded-md p-3 bg-zinc-400 min-h-14 basis-[20%] flex-shrink-0 animate-pulse
         `,
            boxesClassName
          )}
        ></div>
      ))}
    </div>
  );
}

export default BoxesLoading;
