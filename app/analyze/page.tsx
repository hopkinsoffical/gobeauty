import { redirect } from "next/navigation";

// The analyze experience moved to the Get This Look channel (PRD v2 §5).
export default function AnalyzePage() {
  redirect("/get-this-look");
}
