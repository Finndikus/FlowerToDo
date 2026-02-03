"use client";

import { TaskProvider } from "@/context/TaskContext";
import { TaskList } from "@/components/TaskList";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { ListTabs } from "@/components/ListTabs";

export default function Home() {
  return (
    <TaskProvider>
      <main className="min-h-screen bg-background p-4 md:p-10 transition-colors duration-300 relative">
        <ScoreDisplay />
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              Flower To-Do
            </h1>
            <p className="text-muted-foreground text-lg">
              Unlimited nested tasks for the organized mind.
            </p>
          </div>

          <ListTabs />
          <TaskList />
        </div>
      </main>
    </TaskProvider>
  );
}
