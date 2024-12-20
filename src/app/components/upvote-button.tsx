import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export function UpvoteButton({
  sessionId,
  version,
  initialUpvotes = 0,
}: {
  sessionId: string;
  version: string;
  initialUpvotes?: number;
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpvote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/apps/${sessionId}/${version}/upvote`, {
        method: "POST",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upvote");
      }
      
      const data = await response.json();
      setUpvotes(data.upvotes);
      toast.success("Thanks for your vote!", {
        duration: 3000,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upvote. Please try again later", {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleUpvote}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <ThumbsUp size={16} />
      <span>{upvotes}</span>
    </Button>
  );
}
