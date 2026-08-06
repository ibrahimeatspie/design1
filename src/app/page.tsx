import Link from "next/link";
import { Button, Heading, Text } from "frosted-ui";
import { EarningsTicker } from "@/components/earnings-ticker";
import { SiteHeader } from "@/components/site-header";
import { StatsRow } from "@/components/stats-row";
import { StoryCard } from "@/components/story-card";

export default function DashboardPage() {
  // min-h-dvh gives `main` a definite box to grow into; the ancestors only set
  // percentage min-heights, so flex-1 had nothing to divide up and the leftover
  // space all collected below the content.
  return (
    <div className="flex min-h-dvh w-full flex-1 flex-col">
      <SiteHeader />

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-6">
        <div className="flex flex-col items-center gap-3">
          <Heading size="8" weight="bold" align="center" className="max-w-md leading-tight">
            Complete tasks.
            <br />
            Earn money instantly.
          </Heading>
          {/* <Text size="3" color="gray" align="center" className="max-w-md">
            Complete tasks, earn money instantly.
          </Text> */}
        </div>

        <div className="flex w-full max-w-sm flex-col items-center gap-6">
          <EarningsTicker />
          <div className="w-full border-t border-gray-a5 pt-6">
            <StatsRow />
          </div>
        </div>

        <StoryCard />

        <div className="flex flex-col items-center gap-3">
          <Button variant="solid" color="blue" size="4" render={<Link href="/get-started" />}>
            Get started
          </Button>
          <Text size="1" color="gray" align="center">
            Free to join. Get paid the same day.
          </Text>
        </div>
      </main>
    </div>
  );
}
