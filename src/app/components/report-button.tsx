"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ReportButtonProps {
  sessionId: string;
  version: string;
}

export function ReportButton({ sessionId, version }: ReportButtonProps) {
  const reportApp = async () => {
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_url: `${window.location.origin}/apps/${sessionId}/${version}`,
          ban_url: "<placeholder>",
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to report app");
      }
      
      alert("App reported successfully");
    } catch (error) {
      console.error("Error reporting app:", error);
      alert("Failed to report app");
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={reportApp}
      className="flex items-center gap-2"
    >
      <AlertCircle size={16} />
      Report App
    </Button>
  );
}
