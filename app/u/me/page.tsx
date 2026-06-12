// app/u/me/page.tsx — redirect to your own /u/[username]
import { redirect } from "next/navigation";
import { getCurrentGobeautyUser } from "@/lib/profile/queries";

export default async function MyProfilePage() {
  const me = await getCurrentGobeautyUser();
  if (!me) redirect("/?auth=sign-in&next=/u/me");
  redirect(`/u/${me.username}`);
}
