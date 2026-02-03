"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Task } from "@/types";
import { useTaskContext } from "@/context/TaskContext";
import { RichTextEditor } from "./RichTextEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TaskDetailDialogProps {
    taskId: string | null;
    onClose: () => void;
}

export const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
    taskId,
    onClose,
}) => {
    const { tasks, updateTask, updateTaskDescription } = useTaskContext();
    const [task, setTask] = useState<Task | null>(null);
    const [editedContent, setEditedContent] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    // Helper to find task recursively (since tasks in context are nested)
    const findTask = (taskList: Task[], id: string): Task | null => {
        for (const t of taskList) {
            if (t.id === id) return t;
            const found = findTask(t.subtasks, id);
            if (found) return found;
        }
        return null;
    };

    useEffect(() => {
        if (taskId) {
            const foundTask = findTask(tasks, taskId);
            setTask(foundTask);
            if (foundTask) {
                setEditedContent(foundTask.content);
                setEditedDescription(foundTask.description || "");
            }
        } else {
            setTask(null);
            setEditedContent("");
            setEditedDescription("");
        }
    }, [taskId, tasks]);

    const handleSave = () => {
        if (task) {
            if (task.content !== editedContent) {
                updateTask(task.id, editedContent);
            }
            if (task.description !== editedDescription) {
                updateTaskDescription(task.id, editedDescription);
            }
            onClose();
        }
    };

    if (!task) return null;

    return (
        <Dialog open={!!taskId} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto flex flex-col">
                <DialogHeader>
                    <DialogTitle>Task Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 flex-1">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Title
                        </label>
                        <Input
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="text-lg font-semibold"
                            placeholder="Task title"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Description
                        </label>
                        <RichTextEditor
                            content={editedDescription}
                            onChange={setEditedDescription}
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
