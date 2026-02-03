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
import { Input } from "@/components/ui/input";
import { useTaskContext } from "@/context/TaskContext";
import { Save, FolderOpen } from "lucide-react";

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
    const { loadFromDatabase } = useTaskContext();
    const [isLoading, setIsLoading] = useState(false);

    const handleRestore = async () => {
        setIsLoading(true);
        await loadFromDatabase();
        setIsLoading(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Storage Settings</DialogTitle>
                    <DialogDescription>
                        Manage your local task database.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm space-y-2">
                        <p className="font-medium text-primary flex items-center gap-2">
                            Local Database Active
                        </p>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Your tasks are now securely stored in a local JSON database within the project folder.
                            This is more reliable than manual file paths and supports atomic updates.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Database Management</p>
                            <p className="text-xs text-muted-foreground">
                                Manually refresh your current session state with the content of the project database.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full gap-2 text-xs border-destructive/20 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/40"
                            onClick={handleRestore}
                            disabled={isLoading}
                        >
                            <FolderOpen className="h-4 w-4" />
                            Overwrite current session with DB data
                        </Button>
                        <p className="text-[10px] text-destructive/70 italic text-center">
                            Warning: This will discard any unsaved changes in your current view.
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
