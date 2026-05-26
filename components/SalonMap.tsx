import type { Salon } from "@/lib/types";

/**
 * Visual placeholder map. Replace with Mapbox/Google Maps when ready —
 * the contract is just `salons` so swapping is mechanical.
 */
export default function SalonMap({ salons }: { salons: Salon[] }) {
  // Pseudo positions for visual cue only. Order matches salons[i].
  const positions: Array<[number, number]> = [
    [22, 30],
    [55, 18],
    [70, 42],
    [38, 55],
    [18, 68],
    [62, 70],
    [44, 38],
    [80, 60],
    [30, 82],
    [68, 86],
  ];

  return (
    <div className="sticky top-20 hidden md:block">
      <div
        aria-hidden
        className="relative h-[480px] overflow-hidden rounded-2xl border border-line bg-[#eef0e8] shadow-card"
        style={{
          backgroundImage: `
            linear-gradient(135deg, #e8ece2 0%, #f0eee5 60%, #ecebe3 100%),
            repeating-linear-gradient(45deg, transparent 0 18px, rgba(0,0,0,0.025) 18px 19px)
          `,
        }}
      >
        {/* Faux roads */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 480"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M 0 80 Q 120 140 200 100 T 400 180"
            stroke="#ffffff"
            strokeWidth="14"
            fill="none"
          />
          <path
            d="M 0 80 Q 120 140 200 100 T 400 180"
            stroke="#d8d6cb"
            strokeWidth="2"
            strokeDasharray="6 8"
            fill="none"
          />
          <path
            d="M 80 0 Q 140 200 80 380 T 200 480"
            stroke="#ffffff"
            strokeWidth="10"
            fill="none"
          />
          <path
            d="M 320 0 Q 280 200 360 380"
            stroke="#ffffff"
            strokeWidth="12"
            fill="none"
          />
          <path
            d="M 0 320 Q 200 280 400 360"
            stroke="#ffffff"
            strokeWidth="10"
            fill="none"
          />
        </svg>

        {/* Pins */}
        <div className="absolute inset-0">
          {salons.map((s, i) => {
            const [x, y] = positions[i] ?? [50, 50];
            const isTop = s.rank === 1;
            return (
              <div
                key={s.slug}
                title={`${s.rank}. ${s.name}`}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div
                  className={`relative flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-md ring-2 ring-white ${
                    isTop ? "bg-amber-500" : "bg-ink"
                  }`}
                >
                  {s.rank}
                  <span
                    className={`absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent ${
                      isTop ? "border-t-amber-500" : "border-t-ink"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Map controls (decorative) */}
        <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-lg bg-white shadow-sm">
          <button
            type="button"
            aria-label="Zoom in"
            className="flex h-8 w-8 items-center justify-center text-ink hover:bg-surface-soft"
          >
            +
          </button>
          <div className="h-px bg-line-soft" />
          <button
            type="button"
            aria-label="Zoom out"
            className="flex h-8 w-8 items-center justify-center text-ink hover:bg-surface-soft"
          >
            −
          </button>
        </div>

        <div className="absolute bottom-3 left-3 rounded-pill border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ink-soft shadow-sm">
          Edison, NJ · Map view
        </div>
      </div>
      <p className="mt-2 text-center text-[11.5px] text-ink-muted">
        Approximate locations — map is a preview.
      </p>
    </div>
  );
}
