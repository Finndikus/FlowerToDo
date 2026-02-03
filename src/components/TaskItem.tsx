"use client";

import React, { useState, useRef, useEffect } from "react";
import { Task } from "@/types";
import { useTaskContext } from "@/context/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronRight,
    ChevronDown,
    Trash2,
    Plus,
    Palette,
    Briefcase,
    Home,
    Star,
    Zap,
    Bookmark,
    Flag,
    Heart,
    Music,
    Coffee,
    Sun,
    Moon,
    Maximize2,
    Utensils,
    Pizza,
    Gamepad2,
    PartyPopper,
    Code2,
    Terminal,
    Dumbbell,
    Trophy,
    Bike,
    Activity,
    Plane,
    ShoppingBag,
    Camera,
    Tv,
    Book,
} from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableTaskItem } from "./SortableTaskItem";

interface TaskItemProps {
    task: Task;
    level?: number;
    onOpenDetail?: (id: string) => void;
}

const ICONS = [
    { id: "briefcase", icon: Briefcase, label: "Work" },
    { id: "code", icon: Code2, label: "Coding" },
    { id: "terminal", icon: Terminal, label: "Terminal" },
    { id: "activity", icon: Activity, label: "Dev" },
    { id: "home", icon: Home, label: "Home" },
    { id: "star", icon: Star, label: "Important" },
    { id: "zap", icon: Zap, label: "Urgent" },
    { id: "bookmark", icon: Bookmark, label: "Bookmark" },
    { id: "flag", icon: Flag, label: "Flag" },
    { id: "heart", icon: Heart, label: "Personal" },
    { id: "music", icon: Music, label: "Hobby" },
    { id: "gamepad", icon: Gamepad2, label: "Gaming" },
    { id: "party", icon: PartyPopper, label: "Fun" },
    { id: "tv", icon: Tv, label: "Entertain" },
    { id: "coffee", icon: Coffee, label: "Break" },
    { id: "utensils", icon: Utensils, label: "Food" },
    { id: "pizza", icon: Pizza, label: "Pizza" },
    { id: "dumbbell", icon: Dumbbell, label: "Fitness" },
    { id: "tropy", icon: Trophy, label: "Sport" },
    { id: "bike", icon: Bike, label: "Bike" },
    { id: "shopping", icon: ShoppingBag, label: "Shop" },
    { id: "plane", icon: Plane, label: "Travel" },
    { id: "camera", icon: Camera, label: "Photo" },
    { id: "book", icon: Book, label: "Read" },
    { id: "sun", icon: Sun, label: "Morning" },
    { id: "moon", icon: Moon, label: "Evening" },
];

const COLORS = [
    { id: "bg-card", label: "Default", class: "border-border bg-card", preview: "bg-background" },
    { id: "slate", label: "Slate", class: "border-slate-500 bg-slate-500/15", preview: "bg-slate-500" },
    { id: "gray", label: "Gray", class: "border-gray-500 bg-gray-500/15", preview: "bg-gray-500" },
    { id: "zinc", label: "Zinc", class: "border-zinc-500 bg-zinc-500/15", preview: "bg-zinc-500" },
    { id: "neutral", label: "Neutral", class: "border-neutral-500 bg-neutral-500/15", preview: "bg-neutral-500" },
    { id: "stone", label: "Stone", class: "border-stone-500 bg-stone-500/15", preview: "bg-stone-500" },
    { id: "red", label: "Red", class: "border-red-500 bg-red-500/15", preview: "bg-red-500" },
    { id: "orange", label: "Orange", class: "border-orange-500 bg-orange-500/15", preview: "bg-orange-500" },
    { id: "amber", label: "Amber", class: "border-amber-500 bg-amber-500/15", preview: "bg-amber-500" },
    { id: "yellow", label: "Yellow", class: "border-yellow-500 bg-yellow-500/15", preview: "bg-yellow-500" },
    { id: "lime", label: "Lime", class: "border-lime-500 bg-lime-500/15", preview: "bg-lime-500" },
    { id: "green", label: "Green", class: "border-green-500 bg-green-500/15", preview: "bg-green-500" },
    { id: "emerald", label: "Emerald", class: "border-emerald-500 bg-emerald-500/15", preview: "bg-emerald-500" },
    { id: "teal", label: "Teal", class: "border-teal-500 bg-teal-500/15", preview: "bg-teal-500" },
    { id: "cyan", label: "Cyan", class: "border-cyan-500 bg-cyan-500/15", preview: "bg-cyan-500" },
    { id: "sky", label: "Sky", class: "border-sky-500 bg-sky-500/15", preview: "bg-sky-500" },
    { id: "blue", label: "Blue", class: "border-blue-500 bg-blue-500/15", preview: "bg-blue-500" },
    { id: "indigo", label: "Indigo", class: "border-indigo-500 bg-indigo-500/15", preview: "bg-indigo-500" },
    { id: "violet", label: "Violet", class: "border-violet-500 bg-violet-500/15", preview: "bg-violet-500" },
    { id: "purple", label: "Purple", class: "border-purple-500 bg-purple-500/15", preview: "bg-purple-500" },
    { id: "fuchsia", label: "Fuchsia", class: "border-fuchsia-500 bg-fuchsia-500/15", preview: "bg-fuchsia-500" },
    { id: "pink", label: "Pink", class: "border-pink-500 bg-pink-500/15", preview: "bg-pink-500" },
    { id: "rose", label: "Rose", class: "border-rose-500 bg-rose-500/15", preview: "bg-rose-500" },
    { id: "black", label: "Black", class: "border-black/50 bg-black/10 dark:border-white/50 dark:bg-white/10", preview: "bg-black dark:bg-white" },
];

export const TaskItem: React.FC<TaskItemProps> = ({ task, level = 0, onOpenDetail }) => {
    const { toggleTask, deleteTask, updateTask, addTask, toggleOpen, updateTaskVisuals, updateTaskEffort } =
        useTaskContext();
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            setIsEditing(false);
        }
    };

    // Calculate progress recursively
    const getProgress = (t: Task) => {
        let total = 0;
        let completed = 0;

        const traverse = (node: Task) => {
            total++;
            if (node.isCompleted) completed++;
            node.subtasks.forEach(traverse);
        };

        t.subtasks.forEach(traverse);
        return { total, completed };
    };

    const getEffortPoints = (effort?: "S" | "M" | "L") => {
        switch (effort) {
            case "S": return 1;
            case "M": return 2;
            case "L": return 3;
            default: return 0;
        }
    };

    const calculateTotalEffort = (t: Task) => {
        // If it's a leaf, return its own effort
        if (t.subtasks.length === 0) {
            return getEffortPoints(t.effort);
        }
        // If it's a parent, sum children's effort (ignoring its own)
        let points = 0;
        const traverse = (node: Task) => {
            if (node.subtasks.length === 0) {
                points += getEffortPoints(node.effort);
            } else {
                node.subtasks.forEach(traverse);
            }
        };
        t.subtasks.forEach(traverse);
        return points;
    };

    const { total, completed } = getProgress(task);
    const progress = total > 0 ? (completed / total) * 100 : 0;

    const isTopLevel = level === 0;
    const selectedColor = COLORS.find((c) => c.id === task.color) || COLORS[0];
    const SelectedIcon = ICONS.find((i) => i.id === task.icon)?.icon;

    return (
        <div
            className={cn(
                "group flex flex-col gap-1 transition-all duration-300",
                isTopLevel ? "mb-4 p-3 rounded-xl border shadow-sm" : "",
                isTopLevel ? selectedColor.class : ""
            )}
        >
            <div
                className={cn(
                    "flex items-center gap-2 py-1 px-2 rounded-md transition-colors",
                    !isTopLevel && "hover:bg-muted/50",
                    task.isCompleted && "opacity-60"
                )}
                style={{ marginLeft: isTopLevel ? 0 : `${level * 1.5}rem` }}
            >
                {/* Expand/Collapse Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={() => toggleOpen(task.id)}
                >
                    {task.subtasks.length > 0 ? (
                        task.isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )
                    ) : (
                        <div className="h-4 w-4" /> /* Spacer */
                    )}
                </Button>

                {/* Checkbox */}
                <Checkbox
                    checked={task.isCompleted}
                    onCheckedChange={(checked) => {
                        toggleTask(task.id);
                        if (checked) {
                            confetti({
                                particleCount: 100,
                                spread: 70,
                                origin: { y: 0.6 },
                                colors: ['#a855f7', '#3b82f6', '#ec4899'], // Violet, Blue, Pink
                            });
                        }
                    }}
                    className={cn(
                        "rounded-full data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-all",
                        // Darker border for better visibility
                        "border-muted-foreground/40 data-[state=checked]:border-primary",
                        isTopLevel ? "h-5 w-5" : "h-4 w-4"
                    )}
                />

                {/* Top Level Icon */}
                {isTopLevel && SelectedIcon && (
                    <SelectedIcon className="h-4 w-4 text-muted-foreground" />
                )}

                {/* Effort Display (Parent Tasks) */}
                {task.subtasks.length > 0 && (
                    <div className={cn(
                        "px-2 py-0.5 text-xs font-bold rounded-full",
                        isTopLevel ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                        {calculateTotalEffort(task)} pts
                    </div>
                )}

                {/* Effort Dropdown (Leaf Tasks - Top Level) */}
                {isTopLevel && task.subtasks.length === 0 && (
                    <Select
                        value={task.effort || ""}
                        onValueChange={(value) => updateTaskEffort(task.id, value as "S" | "M" | "L")}
                    >
                        <SelectTrigger className="h-6 w-[4.5rem] text-xs px-1 py-0 border-none bg-transparent hover:bg-muted/50 focus:ring-0">
                            <SelectValue placeholder="Est." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="S">S (1)</SelectItem>
                            <SelectItem value="M">M (2)</SelectItem>
                            <SelectItem value="L">L (3)</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <Input
                                ref={inputRef}
                                value={task.content}
                                onChange={(e) => updateTask(task.id, e.target.value)}
                                onBlur={() => setIsEditing(false)}
                                onKeyDown={handleKeyDown}
                                className={cn(
                                    "px-1 py-0 border-none shadow-none focus-visible:ring-0 bg-transparent",
                                    isTopLevel ? "text-base font-medium h-8" : "text-sm h-7"
                                )}
                            />
                        ) : (
                            <span
                                onClick={() => setIsEditing(true)}
                                className={cn(
                                    "block cursor-text truncate py-1 px-1",
                                    task.isCompleted && "line-through text-muted-foreground",
                                    isTopLevel ? "text-base font-medium" : "text-sm"
                                )}
                            >
                                {task.content || "Empty task"}
                            </span>
                        )}
                    </div>

                    {/* Progress Bar */}
                    {total > 0 && (
                        <div className="flex items-center gap-2 px-1 h-1.5 mt-0.5">
                            <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-muted-foreground leading-none">
                                {completed}/{total}
                            </span>
                        </div>
                    )}
                </div>

                {/* Effort Dropdown (Leaf Tasks - Non-Top-Level) */}
                {!isTopLevel && task.subtasks.length === 0 && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Select
                            value={task.effort || ""}
                            onValueChange={(value) => updateTaskEffort(task.id, value as "S" | "M" | "L")}
                        >
                            <SelectTrigger className="h-6 w-[4.5rem] text-xs px-1 py-0 border-none bg-transparent hover:bg-muted/50 focus:ring-0">
                                <SelectValue placeholder="Est." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="S">S (1)</SelectItem>
                                <SelectItem value="M">M (2)</SelectItem>
                                <SelectItem value="L">L (3)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Actions (visible on hover) */}
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    {isTopLevel && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-primary"
                                    title="Customize"
                                >
                                    <Palette className="h-3.5 w-3.5" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-2" align="end">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-xs text-muted-foreground mb-1">
                                        Color
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                        {COLORS.map((color) => (
                                            <button
                                                key={color.id}
                                                className={cn(
                                                    "w-6 h-6 rounded-full border transition-all hover:scale-110",
                                                    color.preview,
                                                    task.color === color.id && "ring-2 ring-primary ring-offset-1"
                                                )}
                                                onClick={() => updateTaskVisuals(task.id, color.id, undefined)}
                                                title={color.label}
                                            />
                                        ))}
                                    </div>
                                    <h4 className="font-medium text-xs text-muted-foreground mb-1 mt-2">
                                        Icon
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                        {ICONS.map((item) => (
                                            <Button
                                                key={item.id}
                                                variant={task.icon === item.id ? "secondary" : "ghost"}
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => updateTaskVisuals(task.id, undefined, item.id)}
                                                title={item.label}
                                            >
                                                <item.icon className="h-3.5 w-3.5" />
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    {onOpenDetail && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-primary"
                            onClick={() => onOpenDetail(task.id)}
                            title="Open Details"
                        >
                            <Maximize2 className="h-3.5 w-3.5" />
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-primary"
                        onClick={() => addTask(task.id, "")}
                        title="Add Subtask"
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTask(task.id)}
                        title="Delete Task"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Subtasks */}
            {task.isOpen && task.subtasks.length > 0 && (
                <div className="flex flex-col">
                    <SortableContext items={task.subtasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {task.subtasks.map((subtask) => (
                            <SortableTaskItem key={subtask.id} task={subtask}>
                                <TaskItem task={subtask} level={level + 1} onOpenDetail={onOpenDetail} />
                            </SortableTaskItem>
                        ))}
                    </SortableContext>
                </div>
            )}
        </div>
    );
};
