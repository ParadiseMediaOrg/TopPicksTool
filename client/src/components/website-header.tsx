import { Plus, Trash2, Upload, FileUp, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WebsiteHeaderProps {
  websiteName: string;
  formatPattern: string;
  subIdCount: number;
  missingUrlCount: number;
  linkedTaskCount: number;
  onGenerateId: () => void;
  onDeleteWebsite: () => void;
  onBulkImport: () => void;
  onBulkClickUpImport: () => void;
  onRefreshUrls: () => void;
  onBulkPostComments: () => void;
  isRefreshing?: boolean;
  isPostingComments?: boolean;
}

export function WebsiteHeader({
  websiteName,
  formatPattern,
  subIdCount,
  missingUrlCount,
  linkedTaskCount,
  onGenerateId,
  onDeleteWebsite,
  onBulkImport,
  onBulkClickUpImport,
  onRefreshUrls,
  onBulkPostComments,
  isRefreshing = false,
  isPostingComments = false,
}: WebsiteHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{websiteName}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="font-mono text-xs px-2.5 py-1">
              {formatPattern}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {subIdCount} Sub-ID{subIdCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="icon"
            onClick={onDeleteWebsite}
            data-testid="button-delete-website"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {missingUrlCount > 0 && (
            <Button
              variant="outline"
              onClick={onRefreshUrls}
              disabled={isRefreshing}
              data-testid="button-refresh-urls"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh URLs ({missingUrlCount})
            </Button>
          )}
          {linkedTaskCount > 0 && (
            <Button
              variant="outline"
              onClick={onBulkPostComments}
              disabled={isPostingComments}
              data-testid="button-bulk-post-comments"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Post Comments ({linkedTaskCount})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onBulkImport}
            data-testid="button-bulk-import"
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import URLs
          </Button>
          <Button
            variant="outline"
            onClick={onBulkClickUpImport}
            data-testid="button-bulk-clickup-import"
          >
            <FileUp className="h-4 w-4 mr-2" />
            Bulk Import ClickUp
          </Button>
          <Button onClick={onGenerateId} data-testid="button-generate-id">
            <Plus className="h-4 w-4 mr-2" />
            Generate Sub-ID
          </Button>
        </div>
      </div>
    </div>
  );
}
