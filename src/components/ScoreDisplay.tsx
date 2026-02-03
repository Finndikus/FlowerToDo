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
        <div className="absolute top-4 right-4 md:top-10 md:right-10 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105">
            <div className={cn("transition-transform duration-300", animate && "scale-125 text-yellow-500")}>
                <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex flex-col items-end leading-none">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Score</span>
                <span className={cn("text-xl font-bold tabular-nums transition-colors", animate && "text-primary")}>
                    {totalScore}
                </span>
            </div>
        </div>
    );
};
