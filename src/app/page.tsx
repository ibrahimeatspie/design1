import Link from "next/link";
import { Button, Heading, Text } from "frosted-ui";
import { EarningsTicker } from "@/components/earnings-ticker";
import { PhotoStack } from "@/components/photo-stack";
import { SiteHeader } from "@/components/site-header";
import { StatsRow } from "@/components/stats-row";

export default function DashboardPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />

      <main className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16">
        <div className="flex flex-col items-center gap-3">
          <Heading size="7" weight="bold" align="center" className="max-w-md">
            People are earning right now
          </Heading>
          <Text size="3" color="gray" align="center" className="max-w-md">
            Complete tasks, earn money instantly.
          </Text>
        </div>

        <div className="flex w-full max-w-sm flex-col items-center gap-8">
          <EarningsTicker />
          <div className="w-full border-t border-gray-a5 pt-8">
            <StatsRow />
          </div>
        </div>

        <PhotoStack />

        <div className="-mt-6 flex flex-col items-center gap-3">
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
