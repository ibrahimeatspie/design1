"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Badge, Text } from "frosted-ui";
import { Bookmark, Check, Clock, Sparkles, X } from "lucide-react";
import { currency, type PackEntry } from "@/lib/bounties";

export type Decision = "claim" | "skip" | "save";

/** Drag distance, in px, that commits a decision on release. */
const COMMIT_DISTANCE = 110;
const COMMIT_VELOCITY = 520;

const exitOffset: Record<Decision, { x: number; y: number }> = {
  claim: { x: 420, y: 0 },
  skip: { x: -420, y: 0 },
  save: { x: 0, y: -560 },
};

export function BountySwipeCard({
  entry,
  decision,
  onDecide,
  reduceMotion,
}: {
  entry: PackEntry;
  /** Drives the exit direction once a decision has been made. */
  decision: Decision | null;
  onDecide: (decision: Decision) => void;
  reduceMotion: boolean;
}) {
  const { bounty, reason } = entry;
  const Icon = bounty.icon;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Dragging stays available under reduced motion — it's direct manipulation,
  // not decoration — but the card no longer tilts and it fades out instead of
  // flying off.
  const rotate = useTransform(x, [-240, 240], reduceMotion ? [0, 0] : [-12, 12]);
  const claimOpacity = useTransform(x, [30, 130], [0, 1]);
  const skipOpacity = useTransform(x, [-130, -30], [1, 0]);
  const saveOpacity = useTransform(y, [-130, -30], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, y, rotate }}
      drag
      dragSnapToOrigin
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        const { offset, velocity } = info;
        const goingUp = offset.y < -COMMIT_DISTANCE && Math.abs(offset.y) > Math.abs(offset.x);

        if (goingUp) onDecide("save");
        else if (offset.x > COMMIT_DISTANCE || velocity.x > COMMIT_VELOCITY) onDecide("claim");
        else if (offset.x < -COMMIT_DISTANCE || velocity.x < -COMMIT_VELOCITY) onDecide("skip");
      }}
      variants={{
        exit: (d: Decision | null) =>
          reduceMotion || !d
            ? { opacity: 0, transition: { duration: 0.18 } }
            : { ...exitOffset[d], opacity: 0, transition: { duration: 0.3, ease: "easeOut" } },
      }}
      exit="exit"
      custom={decision}
    >
      <div className="relative flex h-full w-full cursor-grab flex-col gap-4 overflow-hidden rounded-2xl border border-gray-a5 bg-gray-a2 p-5 active:cursor-grabbing">
        {/* Drag intent overlays. Hidden from AT since the live region already
            announces the outcome of each decision. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
          <motion.span
            style={{ opacity: claimOpacity }}
            className="absolute inset-0 flex items-start justify-start bg-green-a3 p-5"
          >
            <span className="rounded-lg border-2 border-green-9 px-3 py-1 text-green-11">
              <Text size="3" weight="bold">
                Claim
              </Text>
            </span>
          </motion.span>
          <motion.span
            style={{ opacity: skipOpacity }}
            className="absolute inset-0 flex items-start justify-end bg-red-a3 p-5"
          >
            <span className="rounded-lg border-2 border-red-9 px-3 py-1 text-red-11">
              <Text size="3" weight="bold">
                Skip
              </Text>
            </span>
          </motion.span>
          <motion.span
            style={{ opacity: saveOpacity }}
            className="absolute inset-0 flex items-end justify-center bg-blue-a3 p-5"
          >
            <span className="rounded-lg border-2 border-blue-9 px-3 py-1 text-blue-11">
              <Text size="3" weight="bold">
                Save for later
              </Text>
            </span>
          </motion.span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-a3 text-gray-11">
            <Icon size={22} strokeWidth={2} />
          </span>
          <Text size="7" weight="bold" className="tabular-nums">
            {currency(bounty.payout)}
          </Text>
        </div>

        <div className="flex flex-col gap-2">
          <Text size="5" weight="bold" className="block leading-tight">
            {bounty.title}
          </Text>
          <Text size="2" color="gray" className="block">
            {bounty.description}
          </Text>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge size="1" variant="soft" color="gray">
            {bounty.category}
          </Badge>
          <span className="flex items-center gap-1 text-gray-11">
            <Clock size={12} />
            <Text size="1" color="gray">
              {bounty.duration}
            </Text>
          </span>
          <span className="flex items-center gap-1 text-gray-11">
            <Text size="1" color="gray">
              {currency(Math.round(bounty.payout / bounty.hours))}/hr
            </Text>
          </span>
        </div>

        {reason && (
          <div className="mt-auto flex items-center gap-1.5 rounded-lg bg-accent-a3 px-3 py-2 text-accent-11">
            <Sparkles size={13} className="shrink-0" />
            <Text size="1" weight="medium">
              {reason}
            </Text>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function DecisionButtons({ onDecide }: { onDecide: (decision: Decision) => void }) {
  const base =
    "flex cursor-pointer items-center justify-center rounded-full border transition-colors";

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onDecide("skip")}
        aria-label="Skip this bounty"
        className={`${base} h-14 w-14 border-gray-a6 bg-gray-a2 text-gray-11 hover:bg-gray-a3`}
      >
        <X size={22} />
      </button>
      <button
        type="button"
        onClick={() => onDecide("save")}
        aria-label="Save this bounty for later"
        className={`${base} h-11 w-11 border-blue-a7 bg-blue-a3 text-blue-11 hover:bg-blue-a4`}
      >
        <Bookmark size={17} />
      </button>
      <button
        type="button"
        onClick={() => onDecide("claim")}
        aria-label="Claim this bounty"
        className={`${base} h-14 w-14 border-green-a7 bg-green-a3 text-green-11 hover:bg-green-a4`}
      >
        <Check size={22} />
      </button>
    </div>
  );
}
