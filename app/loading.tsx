export default function Loading() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-28 sm:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div className="shimmer h-6 w-48 rounded-full" />
          <div className="shimmer h-16 w-full rounded-xl" />
          <div className="shimmer h-16 w-3/4 rounded-xl" />
          <div className="shimmer h-5 w-2/3 rounded" />
          <div className="flex gap-3 pt-3">
            <div className="shimmer h-12 w-40 rounded-full" />
            <div className="shimmer h-12 w-36 rounded-full" />
          </div>
        </div>
        <div className="shimmer aspect-[4/5] w-full max-w-sm rounded-[1.6rem]" />
      </div>
    </div>
  );
}
