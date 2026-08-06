"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { Text } from "frosted-ui";

interface Stat {
  label: string;
  to: number;
  format: (value: number) => string;
}

const stats: Stat[] = [
  { label: "Paid out this month", to: 2.4, format: (v) => `$${v.toFixed(1)}M` },
  { label: "Active workers", to: 12480, format: (v) => Math.round(v).toLocaleString() },
  { label: "Average payout", to: 184, format: (v) => `$${Math.round(v)}` },
];

function CountUp({ to, format }: Pick<Stat, "to" | "format">) {
  const reduceMotion = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, format);

  useEffect(() => {
    if (reduceMotion) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration: 1.4, ease: "easeOut" });
    return () => controls.stop();
  }, [reduceMotion, to, value]);

  return <motion.span>{text}</motion.span>;
}

export function StatsRow() {
  return (
    <div className="grid w-full grid-cols-3 divide-x divide-gray-a5">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center gap-1 px-2">
          {/* Fixed-width digits stop the label below from shifting mid-count. */}
          <Text size="5" weight="bold" className="block tabular-nums">
            <CountUp to={stat.to} format={stat.format} />
          </Text>
          <Text size="1" color="gray" align="center" className="block">
            {stat.label}
          </Text>
        </div>
      ))}
    </div>
  );
}
