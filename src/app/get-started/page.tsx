import type { Metadata } from "next";
import { Onboarding } from "@/components/onboarding";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Get started",
  description: "Tell us what you're interested in and we'll match you with tasks.",
};

export default function GetStartedPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Onboarding />
      </main>
    </div>
  );
}
