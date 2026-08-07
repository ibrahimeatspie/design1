import {
  AtSign,
  Camera,
  Clapperboard,
  Heart,
  MapPin,
  MessageCircle,
  PenLine,
  Scissors,
  Sparkles,
  Truck,
  Video,
  type LucideIcon,
} from "lucide-react";

export interface Bounty {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  category: string;
  payout: number;
  /** Display label. Kept alongside `hours` so copy reads naturally. */
  duration: string;
  /** Numeric estimate, used to rank by payout per hour. */
  hours: number;
  /** Asset ids from onboarding. Owning any one of them unlocks the bounty. */
  requires?: string[];
}

/**
 * Interest and asset ids are the ones defined in `onboarding.tsx`. They are
 * mirrored rather than imported so this module stays free of UI concerns.
 */
export const INTEREST_CATEGORY: Record<string, string | null> = {
  clipping: "Clipping",
  engagement: "Engagement",
  original: "Original content",
  accounts: "Fan accounts",
  irl: "IRL activation",
  everything: null,
};

export const ASSET_LABEL: Record<string, string> = {
  "head-mount": "a head mount",
  instagram: "old Instagram accounts",
  tiktok: "old TikTok accounts",
  editing: "editing software",
  phone: "a good phone camera",
  car: "a car",
};

export const bounties: Bounty[] = [
  // Clipping
  {
    id: "clip-stream",
    icon: Scissors,
    title: "Clip a livestream",
    description: "Turn a 2 hour stream into 5 short clips",
    category: "Clipping",
    payout: 120,
    duration: "~2 hrs",
    hours: 2,
    requires: ["editing"],
  },
  {
    id: "clip-podcast",
    icon: Scissors,
    title: "Clip a podcast",
    description: "Pull 8 highlights from a 90 minute episode",
    category: "Clipping",
    payout: 140,
    duration: "~2.5 hrs",
    hours: 2.5,
    requires: ["editing"],
  },
  {
    id: "clip-vod",
    icon: Scissors,
    title: "Clip gaming VODs",
    description: "Find 10 funny moments from a stream",
    category: "Clipping",
    payout: 95,
    duration: "~2 hrs",
    hours: 2,
  },
  {
    id: "clip-captions",
    icon: Clapperboard,
    title: "Caption existing clips",
    description: "Add captions to 15 short videos",
    category: "Clipping",
    payout: 70,
    duration: "~1.5 hrs",
    hours: 1.5,
  },
  {
    id: "clip-repost",
    icon: Scissors,
    title: "Repost clips daily",
    description: "Post 3 clips a day for a week",
    category: "Clipping",
    payout: 180,
    duration: "~3.5 hrs",
    hours: 3.5,
    requires: ["tiktok", "instagram"],
  },
  {
    id: "clip-trailer",
    icon: Clapperboard,
    title: "Cut a launch trailer",
    description: "30 seconds from supplied footage",
    category: "Clipping",
    payout: 260,
    duration: "~4 hrs",
    hours: 4,
    requires: ["editing"],
  },

  // Engagement
  {
    id: "engage-posts",
    icon: Heart,
    title: "Engage with posts",
    description: "Like, comment, and share 20 posts",
    category: "Engagement",
    payout: 25,
    duration: "~20 min",
    hours: 0.33,
  },
  {
    id: "engage-comments",
    icon: MessageCircle,
    title: "Seed launch comments",
    description: "Write 30 genuine comments on a launch",
    category: "Engagement",
    payout: 45,
    duration: "~45 min",
    hours: 0.75,
  },
  {
    id: "engage-poll",
    icon: Heart,
    title: "Vote in community polls",
    description: "Take part in 10 polls and share them",
    category: "Engagement",
    payout: 20,
    duration: "~15 min",
    hours: 0.25,
  },
  {
    id: "engage-discord",
    icon: MessageCircle,
    title: "Warm up a Discord",
    description: "Start conversations in a new server",
    category: "Engagement",
    payout: 60,
    duration: "~1 hr",
    hours: 1,
  },
  {
    id: "engage-threads",
    icon: MessageCircle,
    title: "Boost forum threads",
    description: "Upvote and reply to 15 threads",
    category: "Engagement",
    payout: 55,
    duration: "~1 hr",
    hours: 1,
  },

  // Original content
  {
    id: "unboxing",
    icon: Video,
    title: "Film an unboxing",
    description: "Shoot a 60 second video from a brief",
    category: "Original content",
    payout: 180,
    duration: "~1 hr",
    hours: 1,
    requires: ["phone"],
  },
  {
    id: "product-photos",
    icon: Camera,
    title: "Take product photos",
    description: "20 clean photos on a plain background",
    category: "Original content",
    payout: 230,
    duration: "~3 hrs",
    hours: 3,
    requires: ["phone"],
  },
  {
    id: "testimonial",
    icon: Video,
    title: "Record a testimonial",
    description: "Talk about a product for 45 seconds",
    category: "Original content",
    payout: 120,
    duration: "~45 min",
    hours: 0.75,
    requires: ["phone"],
  },
  {
    id: "pov-shift",
    icon: Camera,
    title: "Film a POV shift",
    description: "Wear a head mount for one work shift",
    category: "Original content",
    payout: 340,
    duration: "~4 hrs",
    hours: 4,
    requires: ["head-mount"],
  },
  {
    id: "recipe-video",
    icon: Video,
    title: "Film a recipe video",
    description: "Cook and film one recipe end to end",
    category: "Original content",
    payout: 200,
    duration: "~2.5 hrs",
    hours: 2.5,
    requires: ["phone"],
  },
  {
    id: "bts-footage",
    icon: Camera,
    title: "Capture behind the scenes",
    description: "Head mount footage at a brand event",
    category: "Original content",
    payout: 380,
    duration: "~5 hrs",
    hours: 5,
    requires: ["head-mount"],
  },
  // Every other Original content bounty is gear-gated, so these two keep the
  // category reachable for someone who selected it but owns nothing yet.
  {
    id: "voiceover",
    icon: Video,
    title: "Record a voiceover",
    description: "Read a 30 second script for an ad",
    category: "Original content",
    payout: 70,
    duration: "~30 min",
    hours: 0.5,
  },
  {
    id: "meme-batch",
    icon: Video,
    title: "Make a batch of memes",
    description: "10 memes from a brand's photo library",
    category: "Original content",
    payout: 90,
    duration: "~1 hr",
    hours: 1,
  },

  // Fan accounts
  {
    id: "fan-account",
    icon: AtSign,
    title: "Run a fan account",
    description: "Post daily to a branded account for a week",
    category: "Fan accounts",
    payout: 310,
    duration: "~6 hrs",
    hours: 6,
    requires: ["instagram", "tiktok"],
  },
  {
    id: "grow-account",
    icon: Sparkles,
    title: "Grow a new page",
    description: "Take a page from 0 to 1,000 followers",
    category: "Fan accounts",
    payout: 450,
    duration: "~10 hrs",
    hours: 10,
    requires: ["instagram", "tiktok"],
  },
  {
    id: "story-posts",
    icon: AtSign,
    title: "Post daily stories",
    description: "7 days of stories for one brand",
    category: "Fan accounts",
    payout: 130,
    duration: "~1.5 hrs",
    hours: 1.5,
    requires: ["instagram"],
  },
  {
    id: "account-warmup",
    icon: AtSign,
    title: "Warm up aged accounts",
    description: "Prep 5 accounts for a campaign",
    category: "Fan accounts",
    payout: 160,
    duration: "~2 hrs",
    hours: 2,
    requires: ["instagram", "tiktok"],
  },
  {
    id: "cross-post",
    icon: Sparkles,
    title: "Cross-post a campaign",
    description: "Same campaign across 4 platforms",
    category: "Fan accounts",
    payout: 110,
    duration: "~1.5 hrs",
    hours: 1.5,
  },

  // IRL activation
  {
    id: "flyer-drop",
    icon: MapPin,
    title: "Hand out flyers",
    description: "Promote a brand at a local event",
    category: "IRL activation",
    payout: 95,
    duration: "~2 hrs",
    hours: 2,
  },
  {
    id: "sticker-run",
    icon: MapPin,
    title: "Sticker run downtown",
    description: "Place 50 stickers in high traffic spots",
    category: "IRL activation",
    payout: 80,
    duration: "~1.5 hrs",
    hours: 1.5,
    requires: ["car"],
  },
  {
    id: "popup-staff",
    icon: MapPin,
    title: "Staff a pop-up",
    description: "Work a 4 hour brand activation",
    category: "IRL activation",
    payout: 220,
    duration: "~4 hrs",
    hours: 4,
  },
  {
    id: "street-interviews",
    icon: Video,
    title: "Film street interviews",
    description: "Ask 20 people one question on camera",
    category: "IRL activation",
    payout: 260,
    duration: "~3 hrs",
    hours: 3,
    requires: ["phone", "head-mount"],
  },
  {
    id: "sample-delivery",
    icon: Truck,
    title: "Deliver product samples",
    description: "Drop samples at 10 addresses",
    category: "IRL activation",
    payout: 150,
    duration: "~2.5 hrs",
    hours: 2.5,
    requires: ["car"],
  },

  // Writing
  {
    id: "reviews",
    icon: PenLine,
    title: "Write reviews",
    description: "10 honest reviews, 50 words each",
    category: "Writing",
    payout: 85,
    duration: "~1 hr",
    hours: 1,
  },
  {
    id: "blog-post",
    icon: PenLine,
    title: "Write a blog post",
    description: "800 words on a product you tried",
    category: "Writing",
    payout: 140,
    duration: "~2 hrs",
    hours: 2,
  },
  {
    id: "launch-thread",
    icon: PenLine,
    title: "Write a launch thread",
    description: "10 post thread for a product launch",
    category: "Writing",
    payout: 90,
    duration: "~1.5 hrs",
    hours: 1.5,
  },
  {
    id: "write-captions",
    icon: PenLine,
    title: "Write captions",
    description: "30 captions for scheduled posts",
    category: "Writing",
    payout: 65,
    duration: "~1 hr",
    hours: 1,
  },
];

export interface PackEntry {
  bounty: Bounty;
  /** Why this made the pack. Null for filler picks. */
  reason: string | null;
}

export const PACK_SIZE = 5;

export const currency = (n: number) => `$${n.toLocaleString()}`;

const perHour = (bounty: Bounty) => bounty.payout / bounty.hours;

/** Owning any one required asset unlocks the bounty. */
function unlockedAsset(bounty: Bounty, owned: string[]) {
  if (!bounty.requires) return null;
  return bounty.requires.find((id) => owned.includes(id)) ?? null;
}

function isEligible(bounty: Bounty, owned: string[]) {
  return !bounty.requires || unlockedAsset(bounty, owned) !== null;
}

/**
 * Narrows the full pool down to a single day's pack.
 *
 * Three stages, mirroring how a real recommender would work: drop anything the
 * worker can't actually do, prefer the category they chose, then rank what's
 * left by hourly rate. Deliberately deterministic so the server and client
 * render the same pack.
 */
export function buildPack(
  interest: string | null,
  owned: string[],
  size: number = PACK_SIZE,
): PackEntry[] {
  const category = interest ? INTEREST_CATEGORY[interest] : null;

  const eligible = bounties.filter((bounty) => isEligible(bounty, owned));
  const byRate = [...eligible].sort((a, b) => perHour(b) - perHour(a));

  const preferred = category ? byRate.filter((b) => b.category === category) : byRate;
  const picked = preferred.slice(0, size);

  if (picked.length < size) {
    const chosen = new Set(picked.map((b) => b.id));
    picked.push(...byRate.filter((b) => !chosen.has(b.id)).slice(0, size - picked.length));
  }

  return picked.map((bounty) => {
    const asset = unlockedAsset(bounty, owned);
    if (asset) return { bounty, reason: `Because you have ${ASSET_LABEL[asset]}` };
    if (category && bounty.category === category) {
      return { bounty, reason: `Matches your interest in ${category}` };
    }
    return { bounty, reason: null };
  });
}
