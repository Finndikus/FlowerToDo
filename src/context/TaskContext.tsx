"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Task, TaskList } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { produce } from "immer";

interface TaskContextType {
    lists: TaskList[];
    activeListId: string;
    tasks: Task[]; // Helper to get tasks of active list
    addList: (name: string) => void;
    deleteList: (id: string) => void;
    renameList: (id: string, name: string) => void;
    setActiveList: (id: string) => void;
    addTask: (parentId: string | null, content: string) => void;
    deleteTask: (id: string) => void;
    toggleTask: (id: string) => void;
    updateTask: (id: string, content: string) => void;
    updateTaskVisuals: (id: string, color?: string, icon?: string) => void;
    updateTaskEffort: (id: string, effort: "S" | "M" | "L" | undefined) => void;
    updateTaskDescription: (id: string, description: string) => void;
    reorderTasks: (activeId: string, overId: string) => void;
    toggleOpen: (id: string) => void;
    totalScore: number;
    importLists: (lists: TaskList[]) => void;
    autosavePath: string | null;
    autosaveStatus: "idle" | "syncing" | "synced" | "error";
    autosaveError: string | null;
    isDirty: boolean;
    manualSave: () => Promise<void>;
    loadFromDatabase: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = "ag-taskmanager-data-v2"; // Changed key for versioning/migration

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [lists, setLists] = useState<TaskList[]>([]);
    const [activeListId, setActiveListId] = useState<string>("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");
    const [autosaveError, setAutosaveError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    const createDefaultList = useCallback(() => {
        const defaultList: TaskList = {
            id: uuidv4(),
            name: "My Tasks",
            tasks: [],
        };
        setLists([defaultList]);
        setActiveListId(defaultList.id);
    }, []);

    // Load from local storage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Simple validation
                if (parsed.lists && Array.isArray(parsed.lists) && parsed.activeListId) {
                    setLists(parsed.lists);
                    setActiveListId(parsed.activeListId);
                }
            } catch (e) {
                console.error("Failed to parse tasks", e);
            }
        } else {
            // Migration from v1 or fresh start
            const oldStored = localStorage.getItem("ag-taskmanager-data");
            if (oldStored) {
                try {
                    const oldTasks = JSON.parse(oldStored);
                    const defaultList: TaskList = {
                        id: uuidv4(),
                        name: "My Tasks",
                        tasks: oldTasks,
                    };
                    setLists([defaultList]);
                    setActiveListId(defaultList.id);
                } catch (e) {
                    console.error("Failed to parse old tasks", e);
                    createDefaultList();
                }
            } else {
                createDefaultList();
            }
        }
        setIsLoaded(true);
        // Sync with DB on startup
        loadFromDatabase();
    }, [createDefaultList]);



    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ lists, activeListId }));
        }
    }, [lists, activeListId, isLoaded]);

    // Track dirty state and trigger autosave
    useEffect(() => {
        if (isLoaded) {
            setIsDirty(true);
            setAutosaveStatus("idle");

            const timeoutId = setTimeout(() => {
                manualSave();
            }, 2000); // 2 second debounce for autosave

            return () => clearTimeout(timeoutId);
        }
    }, [lists, isLoaded]);

    const manualSave = async () => {
        setAutosaveStatus("syncing");
        setAutosaveError(null);

        try {
            const res = await fetch("/api/autosave", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: lists,
                }),
            });

            if (res.ok) {
                setAutosaveStatus("synced");
                setIsDirty(false);
            } else {
                let errorDetails = "Unknown error";
                try {
                    const errorData = await res.json();
                    console.error("Save failed:", res.status, errorData);
                    errorDetails = errorData.details || errorData.error || errorDetails;
                } catch (e) {
                    const errorText = await res.text().catch(() => "Could not read response text");
                    console.error("Save failed (non-JSON):", res.status, errorText);
                    errorDetails = errorText || `Error ${res.status}`;
                }
                setAutosaveStatus("error");
                setAutosaveError(errorDetails);
            }
        } catch (err: any) {
            console.error("Save failed:", err);
            setAutosaveStatus("error");
            setAutosaveError(err.message || String(err));
        }
    };

    const loadFromDatabase = async () => {
        try {
            const res = await fetch("/api/load-tasks");
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data)) {
                    setLists(data);
                    setIsDirty(false);
                    setAutosaveStatus("synced");
                    if (data.length > 0) {
                        setActiveListId(data[0].id);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to load from database:", error);
        }
    };


    // Helper to update the active list
    const updateActiveList = (recipe: (draft: Task[]) => void) => {
        setLists(
            produce((draft) => {
                const list = draft.find((l) => l.id === activeListId);
                if (list) {
                    recipe(list.tasks);
                }
            })
        );
    };

    const addList = (name: string) => {
        const newList: TaskList = {
            id: uuidv4(),
            name,
            tasks: [],
        };
        setLists(produce((draft) => {
            draft.push(newList);
        }));
        setActiveListId(newList.id);
    };

    const deleteList = (id: string) => {
        if (lists.length <= 1) return; // Prevent deleting last list
        setLists(produce((draft) => {
            const index = draft.findIndex(l => l.id === id);
            if (index !== -1) {
                draft.splice(index, 1);
            }
        }));
        if (activeListId === id) {
            const newList = lists.find(l => l.id !== id);
            if (newList) setActiveListId(newList.id);
        }
    };

    const renameList = (id: string, name: string) => {
        setLists(produce((draft) => {
            const list = draft.find(l => l.id === id);
            if (list) list.name = name;
        }));
    };

    const setActiveList = (id: string) => {
        setActiveListId(id);
    };

    const importLists = (newLists: TaskList[]) => {
        setLists(newLists);
        if (newLists.length > 0) {
            setActiveListId(newLists[0].id);
        } else {
            createDefaultList();
        }
    };

    const addTask = (parentId: string | null, content: string) => {
        updateActiveList((draft) => {
            const newTask: Task = {
                id: uuidv4(),
                content,
                isCompleted: false,
                subtasks: [],
                isOpen: true,
                color: parentId === null ? "bg-card" : undefined,
            };

            if (parentId === null) {
                draft.push(newTask);
            } else {
                const parent = findTask(draft, parentId);
                if (parent) {
                    parent.subtasks.push(newTask);
                    parent.isOpen = true;
                }
            }
        });
    };

    const deleteTask = (id: string) => {
        updateActiveList((draft) => {
            deleteTaskRecursive(draft, id);
        });
    };

    const toggleTask = (id: string) => {
        updateActiveList((draft) => {
            const task = findTask(draft, id);
            if (task) {
                task.isCompleted = !task.isCompleted;
            }
        });
    };

    const updateTask = (id: string, content: string) => {
        updateActiveList((draft) => {
            const task = findTask(draft, id);
            if (task) {
                task.content = content;
            }
        });
    };

    const updateTaskVisuals = (id: string, color?: string, icon?: string) => {
        updateActiveList((draft) => {
            const task = findTask(draft, id);
            if (task) {
                if (color !== undefined) task.color = color;
                if (icon !== undefined) task.icon = icon;
            }
        });
    };

    const updateTaskEffort = (id: string, effort: "S" | "M" | "L" | undefined) => {
        updateActiveList((draft) => {
            const task = findTask(draft, id);
            if (task) {
                task.effort = effort;
            }
        });
    };

    const updateTaskDescription = (id: string, description: string) => {
        updateActiveList((draft) => {
            const task = findTask(draft, id);
            if (task) {
                task.description = description;
            }
        });
    };

    const toggleOpen = (id: string) => {
        updateActiveList((draft) => {
            const task = findTask(draft, id);
            if (task) {
                task.isOpen = !task.isOpen;
            }
        });
    };

    const reorderTasks = (activeId: string, overId: string) => {
        updateActiveList((draft) => {
            // Helper to find the parent array containing a task ID
            const findParentArray = (tasks: Task[], id: string): Task[] | null => {
                if (tasks.some((t) => t.id === id)) return tasks;
                for (const task of tasks) {
                    const found = findParentArray(task.subtasks, id);
                    if (found) return found;
                }
                return null;
            };

            const sourceList = findParentArray(draft, activeId);
            const destList = findParentArray(draft, overId);

            if (!sourceList || !destList) return;

            const oldIndex = sourceList.findIndex((t) => t.id === activeId);
            const newIndex = destList.findIndex((t) => t.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                // Same list reorder
                if (sourceList === destList) {
                    const [movedTask] = sourceList.splice(oldIndex, 1);
                    sourceList.splice(newIndex, 0, movedTask);
                } else {
                    // Moving between lists (reparenting)
                    const [movedTask] = sourceList.splice(oldIndex, 1);
                    destList.splice(newIndex, 0, movedTask);

                    // Update color if moving to top level (optional, but good for consistency)
                    // If moving from subtask to top level, maybe give it a default color if it doesn't have one?
                    // For now, we keep properties as is.
                }
            }
        });
    };

    // Calculate total score
    const calculateScore = (taskList: Task[]): number => {
        let score = 0;
        const traverse = (task: Task, parentCompleted: boolean) => {
            const isEffectiveCompleted = task.isCompleted || parentCompleted;

            if (isEffectiveCompleted) {
                if (task.subtasks.length === 0) {
                    switch (task.effort) {
                        case "S": score += 1; break;
                        case "M": score += 2; break;
                        case "L": score += 3; break;
                    }
                }
            }

            task.subtasks.forEach(t => traverse(t, isEffectiveCompleted));
        };
        taskList.forEach(t => traverse(t, false));
        return score;
    };

    const activeList = lists.find(l => l.id === activeListId);
    const tasks = activeList ? activeList.tasks : [];
    const totalScore = calculateScore(tasks);

    return (
        <TaskContext.Provider
            value={{
                lists,
                activeListId,
                tasks,
                addList,
                deleteList,
                renameList,
                setActiveList,
                addTask,
                deleteTask,
                toggleTask,
                updateTask,
                updateTaskVisuals,
                updateTaskEffort,
                updateTaskDescription,
                toggleOpen,
                reorderTasks,
                totalScore,
                importLists,
                autosavePath: "Local DB",
                autosaveStatus,
                autosaveError,
                isDirty,
                manualSave,
                loadFromDatabase,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
};

// Helpers
function findTask(tasks: Task[], id: string): Task | null {
    for (const task of tasks) {
        if (task.id === id) return task;
        const found = findTask(task.subtasks, id);
        if (found) return found;
    }
    return null;
}

function deleteTaskRecursive(tasks: Task[], id: string): boolean {
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        return true;
    }
    for (const task of tasks) {
        if (deleteTaskRecursive(task.subtasks, id)) return true;
    }
    return false;
}
