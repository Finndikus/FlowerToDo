"use client";

import React from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Loader2, CheckCircle, AlertCircle, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export const AutosaveIndicator: React.FC = () => {
    const { autosaveStatus, autosaveError, isDirty, manualSave } = useTaskContext();

    return (
        <div
            className={cn(
                "flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-300",
                autosaveStatus === "syncing" ? "bg-primary/5" : "bg-transparent"
            )}
            title={autosaveStatus === "error" ? (autosaveError || "Save failed") : (isDirty ? "Saving changes automatically..." : "All changes saved to project database")}
        >
            {autosaveStatus === "syncing" ? (
                <div className="flex items-center gap-2 text-blue-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs font-medium hidden md:inline">Syncing...</span>
                </div>
            ) : autosaveStatus === "error" ? (
                <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs font-medium hidden md:inline">Autosave Error</span>
                </div>
            ) : isDirty ? (
                <div className="flex items-center gap-2 text-primary">
                    <Database className="h-4 w-4 animate-pulse" />
                    <span className="text-xs font-medium hidden md:inline text-muted-foreground">Autosave...</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-green-500/70">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-medium hidden md:inline text-muted-foreground">Synced</span>
                </div>
            )}
        </div>
    );
};
