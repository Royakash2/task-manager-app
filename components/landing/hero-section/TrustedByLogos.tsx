export const TrustedByLogos = () => {
  return (
    <div className="mt-20 w-full max-w-5xl mx-auto text-muted-foreground font-medium">
      {/* Desktop layout with brackets */}
      <div className="hidden sm:flex items-center gap-6 w-full justify-between">
        <span className="text-3xl font-light opacity-50">{"{"}</span>
        <div className="text-xs tracking-widest uppercase shrink-0 text-muted-foreground">
          Used by fast-moving teams at
        </div>
        <div className="flex items-center gap-8 md:gap-12 lg:gap-16">
          <div className="flex items-center gap-2 font-serif text-lg">
            <span className="font-bold">AXIÒM</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <div className="w-4 h-4 border border-current rounded-sm"></div>
            <span className="font-semibold">SyncBase</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <span className="font-bold tracking-tighter">Novalis</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <div className="w-4 h-4 rounded-full border-[3px] border-current opacity-80"></div>
            <span className="font-semibold tracking-tight">Quotient</span>
          </div>
        </div>
        <span className="text-3xl font-light opacity-50">{"}"}</span>
      </div>

      {/* Mobile layout — clean centered stack */}
      <div className="flex sm:hidden flex-col items-center gap-4 w-full">
        <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Used by fast-moving teams at</p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <div className="font-serif text-lg font-bold">AXIÒM</div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="w-4 h-4 border border-current rounded-sm"></div>
            SyncBase
          </div>
          <div className="text-lg font-bold tracking-tighter">Novalis</div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="w-4 h-4 rounded-full border-[3px] border-current opacity-80"></div>
            Quotient
          </div>
        </div>
      </div>
    </div>
  );
};
