import type { Metadata } from "next";
import { BountyPack } from "@/components/bounty-pack";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Your daily pack",
  description: "Five bounties picked for you, refreshed every 24 hours.",
};

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function PackPage(props: PageProps<"/pack">) {
  const params = await props.searchParams;

  // The onboarding answers arrive in the URL so the pack survives a refresh or
  // a shared link without needing client storage.
  const interest = first(params.interest) ?? null;
  const owned = (first(params.owned) ?? "").split(",").filter(Boolean);

  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col justify-center">
        <BountyPack interest={interest} owned={owned} />
      </main>
    </div>
  );
}
