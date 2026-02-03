"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTaskContext } from "@/context/TaskContext";
import { Download } from "lucide-react";

interface ExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose }) => {
    const { lists } = useTaskContext();
    const [selectedListIds, setSelectedListIds] = useState<string[]>([]);

    // Reset selection when dialog opens
    useEffect(() => {
        if (isOpen) {
            setSelectedListIds(lists.map((l) => l.id));
        }
    }, [isOpen, lists]);

    const handleToggleList = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedListIds((prev) => [...prev, id]);
        } else {
            setSelectedListIds((prev) => prev.filter((listId) => listId !== id));
        }
    };

    const handleExport = () => {
        const listsToExport = lists.filter((l) => selectedListIds.includes(l.id));

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listsToExport, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "ag-taskmanager-export.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export Tasks</DialogTitle>
                    <DialogDescription>
                        Select the task lists you want to export to JSON.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="flex items-center space-x-2 pb-2 border-b">
                        <Checkbox
                            id="select-all"
                            checked={selectedListIds.length === lists.length && lists.length > 0}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setSelectedListIds(lists.map(l => l.id));
                                } else {
                                    setSelectedListIds([]);
                                }
                            }}
                        />
                        <label
                            htmlFor="select-all"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            Select All
                        </label>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pl-1">
                        {lists.map((list) => (
                            <div key={list.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`list-${list.id}`}
                                    checked={selectedListIds.includes(list.id)}
                                    onCheckedChange={(checked) => handleToggleList(list.id, checked as boolean)}
                                />
                                <label
                                    htmlFor={`list-${list.id}`}
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {list.name} <span className="text-muted-foreground text-xs">({list.tasks.length} tasks)</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleExport} disabled={selectedListIds.length === 0} className="gap-2">
                        <Download className="h-4 w-4" />
                        Export JSON
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
