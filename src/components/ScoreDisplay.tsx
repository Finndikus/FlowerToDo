"use client";

import React, { useEffect, useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export const ScoreDisplay: React.FC = () => {
    const { totalScore } = useTaskContext();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 300);
        return () => clearTimeout(timer);
    }, [totalScore]);

    return (
        <div className="flex items-center gap-2 bg-card/40 backdrop-blur-md border border-border/50 px-3 py-1.5 rounded-full shadow-sm transition-all hover:scale-105 hover:bg-card/60">
            <div className={cn("transition-transform duration-300", animate && "scale-125 text-primary")}>
                <Trophy className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider hidden sm:inline">Score</span>
                <span className={cn("text-lg font-bold tabular-nums transition-colors", animate && "text-primary")}>
                    {totalScore}
                </span>
            </div>
        </div>
    );
};
