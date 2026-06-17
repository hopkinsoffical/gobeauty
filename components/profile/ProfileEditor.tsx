"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/profile/actions";
import type { PublicProfile } from "@/lib/profile/queries";

export default function ProfileEditor({ profile }: { profile: PublicProfile }) {
  const router = useRouter();
  const [bio, setBio] = useState(profile.bio || "");
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [pronouns, setPronouns] = useState(profile.pronouns || "");
  const [city, setCity] = useState(profile.city || "");
  const [region, setRegion] = useState(profile.region || "");
  const [isPrivate, setIsPrivate] = useState(profile.is_private);
  const [saving, startSaving] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const handleSave = () => {
    setMsg(null);
    startSaving(async () => {
      const res = await updateProfile({
        bio: bio.trim(),
        display_name: displayName.trim(),
        pronouns: pronouns.trim() || undefined,
        city: city.trim() || undefined,
        region: region.trim() || undefined,
        is_private: isPrivate,
      });
      if (res.ok) {
        setMsg("✓ Saved");
        router.refresh();
      } else {
        setMsg("✗ " + (res.error || "Failed"));
      }
    });
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-line">
        <div className="mx-auto max-w-screen-md px-4 h-12 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-sm font-semibold text-ink-soft">
            Cancel
          </button>
          <div className="text-sm font-bold">Edit profile</div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-sm font-bold text-brand-500 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-screen-md px-4 py-5 space-y-5">
        {/* avatar preview */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-brand-100 border-2 border-white shadow-card">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-500 text-xl font-extrabold">
                {(displayName || profile.username).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold">Profile photo</div>
            <div className="text-xs text-ink-muted">JPG / PNG · max 5MB</div>
          </div>
          <button className="text-xs font-bold border border-line rounded-full px-3 py-1.5">
            Change
          </button>
        </div>

        <Field label="Display name">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="w-full text-sm border border-line rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </Field>

        <Field label="Pronouns" hint="Optional · shown next to your username">
          <input
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
            placeholder="she/her, he/him, they/them…"
            className="w-full text-sm border border-line rounded-xl px-3 py-2.5"
          />
        </Field>

        <Field label="Bio" hint={`${bio.length}/500`}>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 500))}
            placeholder="Tell people about your style"
            rows={4}
            className="w-full text-sm border border-line rounded-xl px-3 py-2.5 resize-none"
          />
        </Field>

        <Field label="Location">
          <div className="flex gap-2">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="flex-1 text-sm border border-line rounded-xl px-3 py-2.5"
            />
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="State"
              className="w-20 text-sm border border-line rounded-xl px-3 py-2.5"
            />
          </div>
        </Field>

        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-bold">Private profile</div>
            <div className="text-xs text-ink-muted">Only followers can see your boards</div>
          </div>
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={[
              "w-11 h-6 rounded-full p-0.5 transition",
              isPrivate ? "bg-brand-500" : "bg-line",
            ].join(" ")}
            aria-checked={isPrivate}
            role="switch"
          >
            <div
              className={[
                "w-5 h-5 bg-white rounded-full shadow transition-transform",
                isPrivate ? "translate-x-5" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </div>

        {msg && (
          <div className="text-center text-sm text-ink-muted">{msg}</div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-bold text-ink-soft">{label}</label>
        {hint && <span className="text-[11px] text-ink-faint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
