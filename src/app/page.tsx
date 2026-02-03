"use client";

import { TaskProvider } from "@/context/TaskContext";
import { TaskList } from "@/components/TaskList";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { ListTabs } from "@/components/ListTabs";
import { Flower } from "lucide-react";

export default function Home() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-background transition-colors duration-300 relative">
        {/* Compact & Unified Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4">
            {/* Top Tier: Logo & Score */}
            <div className="h-14 flex items-center justify-between">
              <div className="flex items-center gap-3 group cursor-default">
                <div className="relative">
                  <Flower className="w-7 h-7 md:w-9 md:h-9 text-primary transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-110 logo-flower" />
                  <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-lg md:text-xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent transition-all duration-500 group-hover:tracking-wider">
                    Flower To-Do
                  </h1>
                </div>
              </div>

              <ScoreDisplay />
            </div>

            {/* Bottom Tier: Navigation */}
            <div className="h-12 border-t border-border/20 flex items-center">
              <ListTabs />
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 md:p-10 space-y-8">
          <TaskList />
        </main>
      </div>
    </TaskProvider>
  );
}
