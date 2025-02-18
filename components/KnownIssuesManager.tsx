import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface KnownIssuesManagerProps {
  issues: string[];
  onUpdateIssues: (newIssues: string[]) => void;
}

export function KnownIssuesManager({ issues, onUpdateIssues }: KnownIssuesManagerProps) {
  const [newIssue, setNewIssue] = useState('');
  const [editingIssues, setEditingIssues] = useState(issues);

  const handleAddIssue = () => {
    if (newIssue.trim()) {
      setEditingIssues([...editingIssues, newIssue.trim()]);
      setNewIssue('');
    }
  };

  const handleRemoveIssue = (index: number) => {
    setEditingIssues(editingIssues.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onUpdateIssues(editingIssues);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-white bg-[#00697F] hover:bg-[#005A6E] hover:text-white">Manage Known Issues</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Known Issues</DialogTitle>
          <DialogDescription>
            Add, edit, or remove known issues to display in the banner.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-issue" className="text-right">
              New Issue
            </Label>
            <Input
              id="new-issue"
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Button onClick={handleAddIssue} className="w-full">Add Issue</Button>
          <div className="space-y-2">
            {editingIssues.map((issue, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input value={issue} readOnly className="flex-grow" />
                <Button onClick={() => handleRemoveIssue(index)} variant="destructive">Remove</Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

