function ProductGraphLoading() {
  return (
    <div className="grid gap-1.5 grid-cols-4 p-2 border border-zinc-200 rounded-sm">
      <div
        className={
          "bg-zinc-300 w-full border border-zinc-300 rounded-md p-2 space-y-2 relative animate-pulse min-h-18"
        }
      ></div>
      <div
        className={
          "bg-zinc-300 w-full border border-zinc-300 rounded-md p-2 space-y-2 relative animate-pulse col-span-2 min-h-18"
        }
      ></div>
      <div
        className={
          "bg-zinc-300 w-full border border-zinc-300 rounded-md p-2 space-y-2 relative animate-pulse min-h-18"
        }
      ></div>
    </div>
  );
}

export default ProductGraphLoading;
