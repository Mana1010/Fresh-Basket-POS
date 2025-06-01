import { useEffect, useState } from "react";

function useSearchDebounce(value: string) {
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value]);
  return debouncedValue;
}

export default useSearchDebounce;
