"use client";

import React, { useState, useRef } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Edit2, Check, Download, Upload, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExportDialog } from "./ExportDialog";
import { SettingsDialog } from "./SettingsDialog";
import { AutosaveIndicator } from "./AutosaveIndicator";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TaskList } from "@/types";

export const ListTabs: React.FC = () => {
    const { lists, activeListId, setActiveList, addList, deleteList, renameList, importLists } = useTaskContext();
    const [isAdding, setIsAdding] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [importData, setImportData] = useState<TaskList[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const parsed = JSON.parse(content);
                    if (Array.isArray(parsed) && parsed.every(l => l.id && l.name && Array.isArray(l.tasks))) {
                        setImportData(parsed);
                    } else {
                        alert("Invalid JSON format. Expected an array of task lists.");
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    alert("Failed to parse JSON file.");
                }
            };
            reader.readAsText(file);
        }
        // Reset input
        if (event.target) {
            event.target.value = "";
        }
    };

    const confirmImport = () => {
        if (importData) {
            importLists(importData);
            setImportData(null);
        }
    };

    const handleAddList = () => {
        if (newListName.trim()) {
            addList(newListName.trim());
            setNewListName("");
            setIsAdding(false);
        }
    };

    const startEditing = (id: string, name: string) => {
        setEditingId(id);
        setEditName(name);
    };

    const saveEdit = () => {
        if (editingId && editName.trim()) {
            renameList(editingId, editName.trim());
            setEditingId(null);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            {lists.map((list) => (
                <div
                    key={list.id}
                    className={cn(
                        "group flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer",
                        activeListId === list.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card hover:bg-muted border-border"
                    )}
                    onClick={() => setActiveList(list.id)}
                >
                    {editingId === list.id ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-6 w-32 px-1 py-0 text-sm bg-background text-foreground"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEdit();
                                }}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-primary-foreground/20"
                                onClick={saveEdit}
                            >
                                <Check className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <span className="text-sm font-medium select-none">{list.name}</span>
                    )}

                    {/* Actions */}
                    <div className={cn(
                        "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
                        editingId === list.id && "hidden"
                    )}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-5 w-5 hover:bg-primary-foreground/20",
                                activeListId === list.id ? "text-primary-foreground" : "text-muted-foreground"
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                startEditing(list.id, list.name);
                            }}
                        >
                            <Edit2 className="h-3 w-3" />
                        </Button>
                        {lists.length > 1 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-5 w-5 hover:bg-destructive/20 hover:text-destructive",
                                    activeListId === list.id ? "text-primary-foreground" : "text-muted-foreground"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteList(list.id);
                                }}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}

            <div className="flex items-center gap-1 ml-2">
                <AutosaveIndicator />
                <div className="w-px h-6 bg-border mx-2" /> {/* Separator */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-primary"
                    onClick={() => setIsSettingsOpen(true)}
                    title="Settings"
                >
                    <Settings className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-primary"
                    onClick={() => setIsExportOpen(true)}
                    title="Export Tasks"
                >
                    <Download className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-primary"
                    onClick={() => fileInputRef.current?.click()}
                    title="Import Tasks"
                >
                    <Upload className="h-4 w-4" />
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleFileChange}
                />

                {/* Add New List Button */}
                {isAdding ? (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg border bg-card">
                        <Input
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder="List name..."
                            className="h-7 w-32 px-2 py-0 text-sm border-none focus-visible:ring-0"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddList();
                                if (e.key === "Escape") setIsAdding(false);
                            }}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={handleAddList}
                        >
                            <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setIsAdding(false)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1 border-dashed"
                        onClick={() => setIsAdding(true)}
                    >
                        <Plus className="h-3.5 w-3.5" />
                        New List
                    </Button>
                )}
            </div>
            <ExportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
            <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            <AlertDialog open={!!importData} onOpenChange={(open) => !open && setImportData(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Import Tasks?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will overwrite all your current task lists with the data from the imported file. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmImport} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Overwrite & Import
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
