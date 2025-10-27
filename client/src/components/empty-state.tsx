import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddWebsite: () => void;
}

export function EmptyState({ onAddWebsite }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <div className="h-12 w-12 text-muted-foreground">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">No Websites Yet</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        Get started by adding your first website to begin generating and
        tracking unique Sub-IDs
      </p>
      <Button onClick={onAddWebsite} data-testid="button-add-first-website">
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Website
      </Button>
    </div>
  );
}
