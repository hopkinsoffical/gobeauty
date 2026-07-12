/** Lightweight stroke icons (lucide-compatible paths) — no extra package. */

import type { ReactNode } from "react";
import type { BenefitItem, FilterDef, PlatformStat } from "@/types/product-landing";

type IconProps = { className?: string; "aria-hidden"?: boolean | "true" | "false" };

function Ico({
  className,
  children,
  ...rest
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={rest["aria-hidden"] ?? true}
    >
      {children}
    </svg>
  );
}

export function IconSearch(p: IconProps) {
  return (
    <Ico {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </Ico>
  );
}
export function IconShield(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
    </Ico>
  );
}
export function IconShieldCheck(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </Ico>
  );
}
export function IconFlower(p: IconProps) {
  return (
    <Ico {...p}>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 4c1.5 2 1.5 4 0 6-1.5-2-1.5-4 0-6zM12 14c1.5 2 1.5 4 0 6-1.5-2-1.5-4 0-6zM4 12c2-1.5 4-1.5 6 0-2 1.5-4 1.5-6 0zM14 12c2-1.5 4-1.5 6 0-2 1.5-4 1.5-6 0z" />
    </Ico>
  );
}
export function IconDroplet(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M12 3s6 6.5 6 11a6 6 0 11-12 0c0-4.5 6-11 6-11z" />
    </Ico>
  );
}
export function IconWine(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M8 3h8l-1 7a5 5 0 11-6 0L8 3z" />
      <path d="M12 15v6M9 21h6" />
    </Ico>
  );
}
export function IconSparkles(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
    </Ico>
  );
}
export function IconLeaf(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M5 19c8 0 12-6 14-14-8 2-14 6-14 14z" />
      <path d="M5 19c2-4 6-7 11-9" />
    </Ico>
  );
}
export function IconSun(p: IconProps) {
  return (
    <Ico {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Ico>
  );
}
export function IconHeart(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M20 8.5c0 5-8 11-8 11S4 13.5 4 8.5A4.5 4.5 0 0112 7a4.5 4.5 0 018 1.5z" />
    </Ico>
  );
}
export function IconBaby(p: IconProps) {
  return (
    <Ico {...p}>
      <circle cx="12" cy="9" r="4" />
      <path d="M6 20c1.5-3 4-4.5 6-4.5S16.5 17 18 20" />
    </Ico>
  );
}
export function IconWaves(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M3 7c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M3 12c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M3 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" />
    </Ico>
  );
}
export function IconPackage(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" />
      <path d="M12 12l8-4M12 12v11M12 12L4 8" />
    </Ico>
  );
}
export function IconStore(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M4 10l1-5h14l1 5" />
      <path d="M4 10h16v10H4z" />
      <path d="M9 20v-6h6v6" />
    </Ico>
  );
}
export function IconBrain(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M9.5 4a3 3 0 00-3 3v1a3 3 0 00-1 5.8V16a3 3 0 003 3h1" />
      <path d="M14.5 4a3 3 0 013 3v1a3 3 0 011 5.8V16a3 3 0 01-3 3h-1" />
      <path d="M9 9h.01M15 9h.01M9.5 14h5" />
    </Ico>
  );
}
export function IconScan(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
      <circle cx="12" cy="12" r="3" />
    </Ico>
  );
}
export function IconUsers(p: IconProps) {
  return (
    <Ico {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3 3-5 7-5s7 2 7 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 20c0-2 1.5-3.5 4-4" />
    </Ico>
  );
}
export function IconPlus(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M12 5v14M5 12h14" />
    </Ico>
  );
}
export function IconSliders(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4" />
    </Ico>
  );
}
export function IconX(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M18 6L6 18M6 6l12 12" />
    </Ico>
  );
}
export function IconArrowRight(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Ico>
  );
}
export function IconStar(p: IconProps) {
  return (
    <Ico {...p}>
      <path d="M12 3l2.5 6.5L21 10l-5 4.2L17.5 21 12 17.3 6.5 21 8 14.2 3 10l6.5-.5L12 3z" />
    </Ico>
  );
}

const FILTER_MAP: Record<FilterDef["icon"], (p: IconProps) => JSX.Element> = {
  shield: IconShield,
  flower: IconFlower,
  droplet: IconDroplet,
  wine: IconWine,
  sparkles: IconSparkles,
  leaf: IconLeaf,
  sun: IconSun,
  heart: IconHeart,
  baby: IconBaby,
  waves: IconWaves,
};
const STAT_MAP: Record<PlatformStat["icon"], (p: IconProps) => JSX.Element> = {
  package: IconPackage,
  store: IconStore,
  brain: IconBrain,
};
const BENEFIT_MAP: Record<BenefitItem["icon"], (p: IconProps) => JSX.Element> = {
  scan: IconScan,
  "shield-check": IconShieldCheck,
  sparkles: IconSparkles,
  users: IconUsers,
};

export function FilterIcon({ name, className }: { name: FilterDef["icon"]; className?: string }) {
  const C = FILTER_MAP[name] ?? IconSparkles;
  return <C className={className} />;
}
export function StatIcon({ name, className }: { name: PlatformStat["icon"]; className?: string }) {
  const C = STAT_MAP[name] ?? IconPackage;
  return <C className={className} />;
}
export function BenefitIcon({ name, className }: { name: BenefitItem["icon"]; className?: string }) {
  const C = BENEFIT_MAP[name] ?? IconSparkles;
  return <C className={className} />;
}
