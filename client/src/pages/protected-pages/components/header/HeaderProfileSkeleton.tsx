function HeaderProfileSkeleton() {
  return (
    <div className="flex items-center border-l-2 border-primary pl-2 min-w-[200px] space-x-1">
      <div className="size-8 rounded-full bg-white relative">
        <div className="absolute inset-0 bg-zinc-400 animate-pulse rounded-full"></div>
      </div>
      <div className="flex flex-col space-y-1.5">
        <span className=" text-[0.8rem] poppins-semibold bg-zinc-400 w-[130px] rounded-3xl h-3 animate-pulse"></span>
        <span className=" text-[0.8rem] poppins-semibold bg-zinc-400 w-[60px] rounded-3xl h-2.5 animate-pulse"></span>
      </div>
    </div>
  );
}

export default HeaderProfileSkeleton;
