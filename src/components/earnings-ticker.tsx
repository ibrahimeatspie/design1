"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, Card, Text } from "frosted-ui";
import { TrendingUp } from "lucide-react";

type AvatarColor = "blue" | "orange" | "green";

interface Sale {
  name: string;
  amount: number;
  task: string;
  time: string;
  color: AvatarColor;
}

const sales: Sale[] = [
  { name: "Bob Reynolds", amount: 540, task: "doing dishes", time: "28 minutes ago", color: "blue" },
  { name: "Amara Chen", amount: 65, task: "testing an app", time: "6 minutes ago", color: "orange" },
  { name: "Kayden Osei", amount: 120, task: "editing video", time: "just now", color: "green" },
  { name: "Luca Ferraro", amount: 310, task: "packing orders", time: "14 minutes ago", color: "blue" },
  { name: "Nina Petrov", amount: 45, task: "washing a dog", time: "2 minutes ago", color: "orange" },
  { name: "Miles Okafor", amount: 230, task: "taking photos", time: "41 minutes ago", color: "green" },
  { name: "Ivy Sandoval", amount: 85, task: "writing reviews", time: "9 minutes ago", color: "blue" },
];

const currency = (n: number) => `$${n.toLocaleString()}`;

const flip = {
  enter: { rotateX: -90, opacity: 0 },
  center: { rotateX: 0, opacity: 1 },
  exit: { rotateX: 90, opacity: 0 },
};

export function EarningsTicker() {
  const [index, setIndex] = useState(0);
  // A 3D rendering context forces the card onto a composited layer, which
  // leaves text grayscale-antialiased and upscaled from the texture rasterized
  // mid-flip. Only establish one while a card is actually moving.
  const [isFlipping, setIsFlipping] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setIsFlipping(true);
      setIndex((i) => (i + 1) % sales.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const sale = sales[index];

  return (
    <div className="w-full max-w-sm" style={isFlipping ? { perspective: 900 } : undefined}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={flip}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: "easeInOut" }}
          onAnimationComplete={(definition) => {
            if (definition === "center") setIsFlipping(false);
          }}
        >
          <Card size="3" variant="surface" className="border border-gray-a5">
            <div className="flex items-center gap-1.5 pb-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-9 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-9" />
              </span>
              <Text size="1" color="gray" weight="medium">
                Live payouts
              </Text>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Avatar size="4" fallback={sale.name[0]} color={sale.color} />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-9 text-white ring-2 ring-[var(--color-panel-solid)]">
                  <TrendingUp size={12} strokeWidth={2.5} />
                </span>
              </div>
              {/* Entries wrap to one or two lines depending on task length;
                  reserving two keeps the card from resizing between flips. */}
              <div className="min-h-[2lh] min-w-0">
                <Text size="3" weight="bold" className="block">
                  {sale.name} made {currency(sale.amount)} {sale.task}
                </Text>
                <Text size="2" color="gray" className="block">
                  {sale.time}
                </Text>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
