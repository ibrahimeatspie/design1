import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Text } from "frosted-ui";

export function StoryCard() {
  return (
    <article className="relative w-full max-w-sm overflow-hidden rounded-2xl">
      {/* Sized against the viewport rather than a fixed aspect ratio so the
          CTA below stays above the fold on short screens. */}
      <div className="relative h-[24dvh] max-h-72 min-h-44 w-full">
        <Image
          src="/placeholder-photo.png"
          alt="John at a market stall in Ecuador"
          fill
          sizes="(max-width: 384px) 100vw, 384px"
          className="object-cover"
          priority
        />
        {/* Scrim keeps the overlaid copy legible regardless of what the photo
            looks like behind it. */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4">
        <Text size="1" weight="bold" className="uppercase tracking-wide text-white/70">
          Member story
        </Text>
        <Text size="3" weight="bold" className="block leading-snug text-white">
          Read about how John helps pay his family&apos;s rent in Ecuador using Workforce
        </Text>
        <span className="flex items-center gap-1.5 text-white/80">
          <Text size="1" weight="medium">
            Read story
          </Text>
          <ArrowRight size={13} />
        </span>
      </div>
    </article>
  );
}
