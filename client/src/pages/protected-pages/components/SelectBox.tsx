import { cn } from "../../../utils/cn";
import { motion } from "framer-motion";
import { selectBoxVariants } from "../../../animation/modal.animation";
import type { Dispatch, SetStateAction } from "react";
type SelectBoxProps = {
  className?: string;
  values: string[];
  options: string[];
  currentValue: string;
  setOpenFilterProduct: Dispatch<SetStateAction<boolean>>;
  handleAction: (value: string) => void;
};
function SelectBox({
  className,
  values,
  options,
  currentValue,
  setOpenFilterProduct,
  handleAction,
}: SelectBoxProps) {
  return (
    <motion.div
      variants={selectBoxVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={cn(
        "bg-zinc-100 border border-zinc-400/35 rounded-sm p-1 absolute z-[9] min-w-[150px]",
        className
      )}
    >
      <ul className="w-full flex flex-col divide-slate-300 divide-y">
        {options.map((option, i) => (
          <li
            onClick={() => {
              handleAction(option);
              setOpenFilterProduct(currentValue === values[i]);
            }}
            key={i}
            value={values[i]}
            role="clickable"
            className={`p-1.5 text-secondary/85 poppins-semibold text-start cursor-pointer hover:bg-zinc-400/20 text-[0.7rem] ${
              currentValue === values[i] && "bg-zinc-400/20"
            }`}
          >
            {option}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default SelectBox;
