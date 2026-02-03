"use client";

import { TaskProvider } from "@/context/TaskContext";
import { TaskList } from "@/components/TaskList";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { ListTabs } from "@/components/ListTabs";
import { Flower } from "lucide-react";

export default function Home() {
  return (
    <TaskProvider>
      <main className="min-h-screen bg-background p-4 md:p-10 transition-colors duration-300 relative">
        <ScoreDisplay />
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2 group cursor-default">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <Flower className="w-10 h-10 md:w-16 md:h-16 text-primary transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-110 logo-flower" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent transition-all duration-500 group-hover:tracking-wider">
                Flower To-Do
              </h1>
            </div>
            <p className="text-muted-foreground text-lg transition-all duration-500 group-hover:text-foreground/80">
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
