"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const rotations = ["-rotate-6", "rotate-3", "-rotate-2"];

const captions = [
  "John bought his sister a birthday cake off Workforce tasks",
  "Maria paid her rent early with her Workforce earnings",
  "Diego surprised his mom with flowers this week",
  "Sofia covered her phone bill in one afternoon",
  "Leo bought concert tickets for his friends",
  "Ava treated her dog to a vet visit",
];

const track = [...captions, ...captions];

export function PhotoStack() {
  return (
    <div className="w-full max-w-md overflow-hidden py-4">
      <motion.div
        className="flex w-max items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {track.map((caption, i) => (
          <div
            key={i}
            className={`w-36 shrink-0 rounded-2xl bg-white p-2 pb-3 shadow-lg ${rotations[i % rotations.length]} ${
              i > 0 ? "-ml-8" : ""
            }`}
          >
            <div className="relative h-32 w-full overflow-hidden rounded-lg">
              <Image src="/placeholder-photo.png" alt="" fill sizes="150px" className="object-cover" />
            </div>
            <p className="mt-2 px-0.5 text-[10px] leading-snug text-black">{caption}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
