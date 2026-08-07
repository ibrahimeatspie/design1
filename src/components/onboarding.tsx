"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Heading, Text } from "frosted-ui";
import {
  AtSign,
  Camera,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Heart,
  LayoutGrid,
  MapPin,
  Music2,
  PartyPopper,
  Scissors,
  Smartphone,
  Video,
  type LucideIcon,
} from "lucide-react";

interface Option {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const interests: Option[] = [
  { id: "clipping", icon: Scissors, title: "Clipping", description: "Turn creator content into short videos" },
  { id: "engagement", icon: Heart, title: "Post engagement", description: "Drive views, likes, and comments" },
  { id: "original", icon: Video, title: "Original content", description: "Film new videos from a brief" },
  { id: "accounts", icon: AtSign, title: "Fan accounts", description: "Create and grow branded accounts" },
  { id: "irl", icon: MapPin, title: "IRL activation", description: "Promote brands in the real world" },
  { id: "everything", icon: LayoutGrid, title: "Something else", description: "Show me everything" },
];

const assets: Option[] = [
  { id: "head-mount", icon: Camera, title: "A head mount", description: "GoPro, Insta360, or similar" },
  { id: "instagram", icon: AtSign, title: "Old Instagram accounts", description: "Aged accounts with some history" },
  { id: "tiktok", icon: Music2, title: "Old TikTok accounts", description: "Aged accounts with some history" },
  { id: "editing", icon: Clapperboard, title: "Editing software", description: "CapCut, Premiere, or similar" },
  { id: "phone", icon: Smartphone, title: "A good phone camera", description: "Shoots clean 1080p or better" },
  { id: "car", icon: Car, title: "A car", description: "For deliveries and IRL tasks" },
];

const TOTAL_STEPS = 3;

/** Answers ride along in the URL so the pack page can curate without any store. */
function packHref(interest: string | null, owned: string[]) {
  const params = new URLSearchParams();
  if (interest) params.set("interest", interest);
  if (owned.length > 0) params.set("owned", owned.join(","));
  const query = params.toString();
  return query ? `/pack?${query}` : "/pack";
}

const backButtonClass =
  "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-a3 text-gray-11 transition-colors hover:bg-gray-a4";

function OptionRow({
  option,
  selected,
  multi,
  onClick,
}: {
  option: Option;
  selected: boolean;
  multi: boolean;
  onClick: () => void;
}) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={multi ? selected : undefined}
      className={`flex w-full cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
        selected ? "border-accent-8 bg-accent-a3" : "border-gray-a5 bg-gray-a2 hover:bg-gray-a3"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
          selected ? "bg-accent-a4 text-accent-11" : "bg-gray-a3 text-gray-11"
        }`}
      >
        <Icon size={20} strokeWidth={2} />
      </span>

      <span className="min-w-0 flex-1">
        <Text size="3" weight="bold" className="block">
          {option.title}
        </Text>
        <Text size="2" color="gray" className="block">
          {option.description}
        </Text>
      </span>

      {multi ? (
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
            selected ? "border-accent-9 bg-accent-9 text-white" : "border-gray-a7"
          }`}
        >
          {selected && <Check size={14} strokeWidth={3} />}
        </span>
      ) : (
        <ChevronRight size={18} className="shrink-0 text-gray-a9" />
      )}
    </button>
  );
}

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [interest, setInterest] = useState<string | null>(null);
  const [owned, setOwned] = useState<string[]>([]);

  const toggleOwned = (id: string) =>
    setOwned((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* The first step steps back out to the landing page so the control
              never disappears and leave the questionnaire feeling like a trap. */}
          {step === 0 ? (
            <Link href="/" aria-label="Back to home" className={backButtonClass}>
              <ChevronLeft size={18} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              aria-label="Go back"
              className={backButtonClass}
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <Text size="1" color="gray" weight="medium">
            Step {Math.min(step + 1, TOTAL_STEPS)} of {TOTAL_STEPS}
          </Text>
        </div>

        <div
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          className="h-1 w-full overflow-hidden rounded-full bg-gray-a4"
        >
          <motion.div
            className="h-full rounded-full bg-accent-9"
            initial={false}
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          {step === 0 && (
            <>
              <div className="flex flex-col gap-2">
                <Heading size="6" weight="bold">
                  What are you most interested in?
                </Heading>
                <Text size="2" color="gray">
                  We&apos;ll match you with tasks that fit.
                </Text>
              </div>

              <div className="flex flex-col gap-3">
                {interests.map((option) => (
                  <OptionRow
                    key={option.id}
                    option={option}
                    selected={interest === option.id}
                    multi={false}
                    onClick={() => {
                      setInterest(option.id);
                      setStep(1);
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="flex flex-col gap-2">
                <Heading size="6" weight="bold">
                  What do you already have?
                </Heading>
                <Text size="2" color="gray">
                  Select all that apply. Some tasks pay more if you have these.
                </Text>
              </div>

              <div className="flex flex-col gap-3">
                {assets.map((option) => (
                  <OptionRow
                    key={option.id}
                    option={option}
                    selected={owned.includes(option.id)}
                    multi
                    onClick={() => toggleOwned(option.id)}
                  />
                ))}
              </div>

              <Button variant="solid" color="blue" size="4" onClick={() => setStep(2)}>
                Continue
              </Button>
            </>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-a3 text-green-11">
                <PartyPopper size={26} />
              </span>
              <Heading size="6" weight="bold">
                You&apos;re all set
              </Heading>
              <Text size="2" color="gray">
                We found{" "}
                <Text size="2" weight="bold" color="gray" highContrast>
                  {12 + owned.length * 7}
                </Text>{" "}
                tasks matching what you picked, and narrowed them to a pack of five.
              </Text>
              <Button
                variant="solid"
                color="blue"
                size="4"
                className="mt-2"
                nativeButton={false}
                render={<Link href={packHref(interest, owned)} />}
              >
                Open your pack
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
