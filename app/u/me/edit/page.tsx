// app/u/me/edit/page.tsx
// Edit your own profile
import { redirect } from "next/navigation";
import { getCurrentGobeautyUser, getProfileById } from "@/lib/profile/queries";
import ProfileEditor from "@/components/profile/ProfileEditor";

export default async function EditProfilePage() {
  const me = await getCurrentGobeautyUser();
  if (!me) redirect("/?auth=sign-in&next=/u/me/edit");
  const profile = await getProfileById(me.id);
  if (!profile) redirect("/u/me");

  return <ProfileEditor profile={profile} />;
}
