import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { TaskList } from "@/components/task-list";

export const metadata: Metadata = {
  title: "Available tasks",
  description: "Browse tasks matched to your profile and get paid the same day.",
};

export default function TasksPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <TaskList />
      </main>
    </div>
  );
}
