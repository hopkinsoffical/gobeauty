import { redirect } from "next/navigation";

/** Legacy path — canonical route is /skin-analyzer. */
export default function SkinAiRedirectPage() {
  redirect("/skin-analyzer");
}
