export function ProjectsSkeleton() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
      <div className="shimmer h-12 w-2/3 max-w-md rounded-lg" />
      <div className="shimmer mt-4 h-5 w-full max-w-lg rounded" />
      <div className="mt-16 flex flex-col gap-24">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14"
          >
            <div
              className={`shimmer aspect-[16/10] w-full rounded-xl ${
                i % 2 ? "lg:order-2" : ""
              }`}
            />
            <div className={i % 2 ? "lg:order-1" : ""}>
              <div className="shimmer h-4 w-32 rounded" />
              <div className="shimmer mt-4 h-9 w-3/4 rounded-lg" />
              <div className="shimmer mt-4 h-16 w-full rounded" />
              <div className="mt-5 flex gap-2">
                <div className="shimmer h-7 w-16 rounded-md" />
                <div className="shimmer h-7 w-16 rounded-md" />
                <div className="shimmer h-7 w-16 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
