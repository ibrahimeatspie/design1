"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Badge, Button, Heading, Text } from "frosted-ui";
import { Bookmark, Check, Clock } from "lucide-react";
import { BountyPackScene } from "@/components/bounty-pack-scene";
import { BountySwipeCard, DecisionButtons, type Decision } from "@/components/bounty-swipe-card";
import { buildPack, currency, PACK_SIZE, type Bounty, type PackEntry } from "@/lib/bounties";

// Layout width for the elements below the 3D pack (badges row, Open button);
// the pack itself is rendered by BountyPackScene inside a taller canvas so
// the tear animation has room to fly beyond the flat card's footprint.
const PANEL_WIDTH = 224;

function SealedPack({
  pack,
  onOpen,
  reduceMotion,
}: {
  pack: PackEntry[];
  onOpen: () => void;
  reduceMotion: boolean;
}) {
  const [opening, setOpening] = useState(false);
  const total = pack.reduce((sum, entry) => sum + entry.bounty.payout, 0);
  const categories = Array.from(new Set(pack.map((entry) => entry.bounty.category)));

  const open = () => {
    if (reduceMotion) {
      onOpen();
      return;
    }
    setOpening(true);
  };

  return (
    <motion.div
      key="sealed"
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="flex flex-col items-center gap-6"
    >
      <div className="flex flex-col items-center gap-1.5 text-center">
        <Heading size="5" weight="bold">
          Your bounty pack is ready
        </Heading>
        <Text size="2" color="gray" className="max-w-[26ch]">
          {PACK_SIZE} tasks worth{" "}
          <Text size="2" weight="bold" color="gray" highContrast>
            {currency(total)}
          </Text>{" "}
          — open it to see what&apos;s inside.
        </Text>
      </div>

      <div className="h-[400px] w-[300px]">
        <BountyPackScene opening={opening} reduceMotion={reduceMotion} onOpenComplete={onOpen} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5" style={{ maxWidth: PANEL_WIDTH }}>
        {categories.map((category) => (
          <Badge key={category} size="1" variant="soft" color="gray">
            {category}
          </Badge>
        ))}
      </div>

      <div className="relative z-0">
        {!opening && !reduceMotion && (
          <div
            aria-hidden
            className="animate-pulse-glow absolute inset-0 -z-10 rounded-full bg-blue-9"
            style={{ filter: "blur(18px)" }}
          />
        )}
        <Button
          variant="solid"
          color="blue"
          size="4"
          disabled={opening}
          onClick={open}
          aria-label={`Open pack of ${PACK_SIZE} bounties`}
          className="rounded-full"
          style={{ width: PANEL_WIDTH }}
        >
          Open
        </Button>
      </div>

      <Text size="2" color="gray" align="center" className="max-w-xs">
        A fresh pack drops every 24 hours, matched to what you told us.
      </Text>
    </motion.div>
  );
}

function ClaimedRow({ bounty }: { bounty: Bounty }) {
  const Icon = bounty.icon;

  return (
    <li className="flex items-center gap-3 rounded-xl border border-gray-a5 bg-gray-a2 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-a3 text-gray-11">
        <Icon size={17} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <Text size="2" weight="bold" className="block">
          {bounty.title}
        </Text>
        <span className="flex items-center gap-1 text-gray-11">
          <Clock size={11} />
          <Text size="1" color="gray">
            {bounty.duration}
          </Text>
        </span>
      </span>
      <Text size="3" weight="bold" className="shrink-0 tabular-nums">
        {currency(bounty.payout)}
      </Text>
    </li>
  );
}

function Summary({ claimed, saved }: { claimed: Bounty[]; saved: Bounty[] }) {
  const total = claimed.reduce((sum, b) => sum + b.payout, 0);

  return (
    <motion.div
      key="summary"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-a3 text-green-11">
          <Check size={26} strokeWidth={2.5} />
        </span>
        <Heading size="6" weight="bold">
          {claimed.length > 0 ? "Pack claimed" : "Pack cleared"}
        </Heading>
        {claimed.length > 0 ? (
          <Text size="2" color="gray">
            You claimed {claimed.length} of {PACK_SIZE} bounties worth{" "}
            <Text size="2" weight="bold" color="gray" highContrast>
              {currency(total)}
            </Text>{" "}
            all together.
          </Text>
        ) : (
          <Text size="2" color="gray">
            Nothing caught your eye this time. Your next pack will lean on what you skipped.
          </Text>
        )}
      </div>

      {claimed.length > 0 && (
        <ul className="flex flex-col gap-2">
          {claimed.map((bounty) => (
            <ClaimedRow key={bounty.id} bounty={bounty} />
          ))}
        </ul>
      )}

      {saved.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-a6 bg-blue-a2 p-3 text-blue-11">
          <Bookmark size={15} className="shrink-0" />
          <Text size="2">
            {saved.length} saved for later
          </Text>
        </div>
      )}

      <div className="flex flex-col items-center gap-3 border-t border-gray-a5 pt-6">
        <Text size="2" color="gray">
          Your next pack unlocks in 24h
        </Text>
        <Button
          variant="soft"
          color="gray"
          size="3"
          nativeButton={false}
          render={<Link href="/tasks" />}
        >
          Browse everything instead
        </Button>
      </div>
    </motion.div>
  );
}

export function BountyPack({ interest, owned }: { interest: string | null; owned: string[] }) {
  const pack = useMemo(() => buildPack(interest, owned), [interest, owned]);
  const reduceMotion = useReducedMotion() ?? false;

  const [opened, setOpened] = useState(false);
  const [index, setIndex] = useState(0);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [claimed, setClaimed] = useState<Bounty[]>([]);
  const [saved, setSaved] = useState<Bounty[]>([]);
  // Held back until the last card has finished flying off, so the summary
  // doesn't cut the exit animation short.
  const [finished, setFinished] = useState(false);

  const current = pack[index];

  const decide = (next: Decision) => {
    if (!current) return;

    setDecision(next);
    if (next === "claim") setClaimed((list) => [...list, current.bounty]);
    if (next === "save") setSaved((list) => [...list, current.bounty]);
    setIndex((i) => i + 1);
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 px-6 py-8">
      <AnimatePresence mode="wait" initial={false}>
        {!opened && (
          <SealedPack key="sealed" pack={pack} onOpen={() => setOpened(true)} reduceMotion={reduceMotion} />
        )}

        {opened && !finished && (
          <motion.div
            key="deck"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <Heading size="4" weight="bold">
                Today&apos;s pack
              </Heading>
              <Text size="1" color="gray" weight="medium" className="tabular-nums">
                {Math.min(index + 1, pack.length)} of {pack.length}
              </Text>
            </div>

            <div className="h-1 w-full overflow-hidden rounded-full bg-gray-a4">
              <motion.div
                className="h-full rounded-full bg-accent-9"
                initial={false}
                animate={{ width: `${(index / pack.length) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            <div
              role="group"
              tabIndex={0}
              aria-label="Bounty deck. Use the left and right arrow keys to skip or claim, and the up arrow to save for later."
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") decide("skip");
                else if (event.key === "ArrowRight") decide("claim");
                else if (event.key === "ArrowUp") decide("save");
                else return;
                event.preventDefault();
              }}
              className="relative h-96 w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent-8"
            >
              {/* Peeks of the next two cards, to make the stack read as a pack. */}
              {[2, 1].map((depth) => {
                const behind = pack[index + depth];
                if (!behind) return null;

                return (
                  <div
                    key={behind.bounty.id}
                    aria-hidden
                    style={{ transform: `translateY(${depth * 8}px) scale(${1 - depth * 0.04})` }}
                    className="absolute inset-0 rounded-2xl border border-gray-a5 bg-gray-a2"
                  />
                );
              })}

              <AnimatePresence
                custom={decision}
                onExitComplete={() => {
                  if (index >= pack.length) setFinished(true);
                }}
              >
                {current && (
                  <BountySwipeCard
                    key={current.bounty.id}
                    entry={current}
                    decision={decision}
                    onDecide={decide}
                    reduceMotion={reduceMotion}
                  />
                )}
              </AnimatePresence>
            </div>

            <DecisionButtons onDecide={decide} />

            <Text size="1" color="gray" align="center">
              Swipe right to claim, left to skip, up to save
            </Text>

            <span aria-live="polite" className="sr-only">
              {current
                ? `Bounty ${index + 1} of ${pack.length}. ${current.bounty.title}, ${currency(
                    current.bounty.payout,
                  )}, ${current.bounty.duration}.`
                : "Pack complete."}
            </span>
          </motion.div>
        )}

        {finished && <Summary key="summary" claimed={claimed} saved={saved} />}
      </AnimatePresence>
    </div>
  );
}
