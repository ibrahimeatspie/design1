import { Badge, Heading, Text } from "frosted-ui";
import { AtSign, Camera, Clock, Heart, MapPin, PenLine, Scissors, Video, type LucideIcon } from "lucide-react";

interface Task {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  category: string;
  payout: number;
  duration: string;
}

const tasks: Task[] = [
  {
    id: "clip-stream",
    icon: Scissors,
    title: "Clip a livestream",
    description: "Turn a 2 hour stream into 5 short clips",
    category: "Clipping",
    payout: 120,
    duration: "~2 hrs",
  },
  {
    id: "engage-posts",
    icon: Heart,
    title: "Engage with posts",
    description: "Like, comment, and share 20 posts",
    category: "Engagement",
    payout: 25,
    duration: "~20 min",
  },
  {
    id: "unboxing",
    icon: Video,
    title: "Film an unboxing",
    description: "Shoot a 60 second video from a brief",
    category: "Original content",
    payout: 180,
    duration: "~1 hr",
  },
  {
    id: "fan-account",
    icon: AtSign,
    title: "Run a fan account",
    description: "Post daily to a branded account for a week",
    category: "Fan accounts",
    payout: 310,
    duration: "1 week",
  },
  {
    id: "product-photos",
    icon: Camera,
    title: "Take product photos",
    description: "20 clean photos on a plain background",
    category: "Original content",
    payout: 230,
    duration: "~3 hrs",
  },
  {
    id: "flyer-drop",
    icon: MapPin,
    title: "Hand out flyers",
    description: "Promote a brand at a local event",
    category: "IRL activation",
    payout: 95,
    duration: "~2 hrs",
  },
  {
    id: "reviews",
    icon: PenLine,
    title: "Write reviews",
    description: "10 honest reviews, 50 words each",
    category: "Writing",
    payout: 85,
    duration: "~1 hr",
  },
];

const currency = (n: number) => `$${n.toLocaleString()}`;

export function TaskList() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <Heading size="6" weight="bold">
          Available tasks
        </Heading>
        <Text size="2" color="gray">
          {tasks.length} tasks matching what you picked. Paid out same day.
        </Text>
      </div>

      <ul className="flex flex-col gap-3">
        {tasks.map((task) => {
          const Icon = task.icon;

          return (
            <li
              key={task.id}
              className="flex items-start gap-4 rounded-xl border border-gray-a5 bg-gray-a2 p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-a3 text-gray-11">
                <Icon size={20} strokeWidth={2} />
              </span>

              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Text size="3" weight="bold" className="block">
                  {task.title}
                </Text>
                <Text size="2" color="gray" className="block">
                  {task.description}
                </Text>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <Badge size="1" variant="soft" color="gray">
                    {task.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-gray-11">
                    <Clock size={12} />
                    <Text size="1" color="gray">
                      {task.duration}
                    </Text>
                  </span>
                </div>
              </div>

              <Text size="4" weight="bold" className="shrink-0 tabular-nums">
                {currency(task.payout)}
              </Text>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
