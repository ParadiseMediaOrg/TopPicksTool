import { Plus, Globe, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Website } from "@shared/schema";

type WebsiteWithCount = Website & { subIdCount: number };

interface WebsiteOverviewProps {
  websites: WebsiteWithCount[];
  onSelectWebsite: (id: string) => void;
  onAddWebsite: () => void;
}

export function WebsiteOverview({ websites, onSelectWebsite, onAddWebsite }: WebsiteOverviewProps) {
  return (
    <div className="h-full overflow-auto">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Your Websites</h1>
            <p className="text-muted-foreground">
              Manage Sub-IDs across {websites.length} website{websites.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={onAddWebsite} size="lg" data-testid="button-add-website-overview">
            <Plus className="h-4 w-4 mr-2" />
            Add Website
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <Card
              key={website.id}
              className="hover-elevate active-elevate-2 cursor-pointer transition-all"
              onClick={() => onSelectWebsite(website.id)}
              data-testid={`card-website-${website.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {website.subIdCount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <CardTitle className="text-xl mb-1 line-clamp-1">{website.name}</CardTitle>
                  <CardDescription className="font-mono text-xs line-clamp-1">
                    {website.formatPattern}
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-4 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">{website.subIdCount}</span>
                    <span className="hidden sm:inline">Sub-ID{website.subIdCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
