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
        {/* Compact Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3 group cursor-default">
              <div className="relative">
                <Flower className="w-8 h-8 md:w-10 md:h-10 text-primary transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-110 logo-flower" />
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent transition-all duration-500 group-hover:tracking-wider">
                  Flower To-Do
                </h1>
                <p className="text-[10px] md:text-xs text-muted-foreground transition-all duration-500 group-hover:text-foreground/80 hidden sm:block">
                  Unlimited nested tasks
                </p>
              </div>
            </div>

            {/* Right Side: Score & More */}
            <div className="flex items-center gap-4">
              <ScoreDisplay />
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 md:p-10 space-y-8">
          <ListTabs />
          <TaskList />
        </main>
      </div>
    </TaskProvider>
  );
}
