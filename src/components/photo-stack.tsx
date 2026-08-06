"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Text } from "frosted-ui";

interface Item {
  name: string;
  amount: string;
  task: string;
}

const items: Item[] = [
  { name: "Alex", amount: "$1,240", task: "clipping videos" },
  { name: "Priya", amount: "$860", task: "product testing" },
  { name: "Jordan", amount: "$2,100", task: "photography" },
  { name: "Sam", amount: "$540", task: "delivery runs" },
  { name: "Maya", amount: "$1,780", task: "editing reels" },
  { name: "Theo", amount: "$920", task: "IRL activation" },
];

// Duplicated once so animating the track from 0% to -50% loops seamlessly.
const track = [...items, ...items];

export function PhotoStack() {
  return (
    <div
      className="w-full max-w-md overflow-hidden py-4"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {track.map((item, i) => (
          <div
            key={i}
            className="relative h-44 w-32 shrink-0 overflow-hidden rounded-2xl border border-gray-a5 shadow-lg"
          >
            <Image src="/placeholder-photo.png" alt="" fill sizes="128px" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-5 pb-1.5">
              <Text size="1" weight="medium" className="block truncate text-white">
                {item.name} made {item.amount} doing {item.task}
              </Text>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
