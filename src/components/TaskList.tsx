"use client";

import React, { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { TaskItem } from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";
import { TaskDetailDialog } from "./TaskDetailDialog";

import { SortableTaskItem } from "./SortableTaskItem";

export const TaskList: React.FC = () => {
    const { tasks, addTask, reorderTasks } = useTaskContext();
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            reorderTasks(active.id as string, over.id as string);
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto mt-10 shadow-xl border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    My Tasks
                </CardTitle>
                <Button
                    onClick={() => addTask(null, "New Task")}
                    size="sm"
                    className="gap-1"
                >
                    <Plus className="h-4 w-4" />
                    Add Task
                </Button>
            </CardHeader>
            <CardContent className="space-y-1">
                {tasks.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No tasks yet. Start by adding one!</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={tasks.map((t) => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {tasks.map((task) => (
                                    <SortableTaskItem key={task.id} task={task}>
                                        <TaskItem task={task} onOpenDetail={(id) => setSelectedTaskId(id)} />
                                    </SortableTaskItem>
                                ))}
                            </div>
                        </SortableContext>

                        <TaskDetailDialog
                            taskId={selectedTaskId}
                            onClose={() => setSelectedTaskId(null)}
                        />
                    </DndContext>
                )}
            </CardContent>
        </Card>
    );
};
