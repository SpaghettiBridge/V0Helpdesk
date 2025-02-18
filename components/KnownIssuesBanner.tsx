import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface KnownIssuesBannerProps {
  issues: string[];
}

export function KnownIssuesBanner({ issues }: KnownIssuesBannerProps) {
  if (issues.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Known Issues</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside">
          {issues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

