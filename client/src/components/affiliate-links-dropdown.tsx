import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link, Copy, Check, ChevronDown, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AffiliateLinkDropdownProps {
  clickupTaskId: string;
  subIdValue: string;
}

// Common affiliate tracking parameter names (comprehensive list)
const affiliateParams = [
  // Primary tracking params
  'payload', 'subid', 'sub_id', 'clickid', 'click_id', 'clickID',
  // Campaign params
  'campaign', 'campaign_id', 'affid', 'aff_id',
  // Additional tracking params
  'tracking', 'tracker', 'ref', 'reference', 'source',
  // UTM params
  'utm_campaign', 'utm_source', 'utm_medium', 'utm_term', 'utm_content',
  // Miscellaneous
  'pid', 'aid', 'sid', 'cid', 'tid', 'btag', 'tag', 'var',
  'raw', 'nci', 'nkw', 'lpid', 'bid'
];

function findTrackingParam(url: string): { param: string; value: string } | null {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    
    // First pass: exact case-sensitive match
    for (const param of affiliateParams) {
      const value = urlObj.searchParams.get(param);
      if (value) {
        return { param, value };
      }
    }
    
    // Second pass: case-insensitive match for params like clickID vs clickid
    const allParams = Array.from(urlObj.searchParams.keys());
    for (const actualParam of allParams) {
      for (const knownParam of affiliateParams) {
        if (actualParam.toLowerCase() === knownParam.toLowerCase()) {
          const value = urlObj.searchParams.get(actualParam);
          if (value) {
            return { param: actualParam, value };
          }
        }
      }
    }
  } catch (e) {
    // Fallback for malformed URLs - use regex with case-insensitive matching
    for (const param of affiliateParams) {
      const match = url.match(new RegExp(`${param}=([^&\\s]+)`, 'i'));
      if (match) {
        // Extract the actual parameter name from the URL to preserve case
        const actualParamMatch = url.match(new RegExp(`(${param})=`, 'i'));
        const actualParam = actualParamMatch ? actualParamMatch[1] : param;
        return { param: actualParam, value: match[1] };
      }
    }
  }
  return null;
}

function safeGetPayload(url: string): string | null {
  const tracking = findTrackingParam(url);
  return tracking ? tracking.value : null;
}

function safeReplacePayload(url: string, newPayload: string): string {
  const tracking = findTrackingParam(url);
  if (!tracking) return url;
  
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set(tracking.param, newPayload);
    return urlObj.toString();
  } catch (e) {
    // Fallback for malformed/relative URLs
    return url.replace(
      new RegExp(`${tracking.param}=[^&\\s]+`, 'i'), 
      `${tracking.param}=${newPayload}`
    );
  }
}

export function AffiliateLinkDropdown({ clickupTaskId, subIdValue }: AffiliateLinkDropdownProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<{ links: Array<{url: string, brand: string, position: string}> }>({
    queryKey: ['/api/clickup/task', clickupTaskId, 'affiliate-links'],
    enabled: !!clickupTaskId && isOpen,
  });

  const affiliateLinks = data?.links || [];

  const handleCopyLink = async (originalUrl: string) => {
    try {
      const modifiedUrl = safeReplacePayload(originalUrl, subIdValue);
      await navigator.clipboard.writeText(modifiedUrl);
      setCopiedUrl(originalUrl);
      toast({
        title: "Link copied!",
        description: "Affiliate link with your Sub-ID has been copied to clipboard.",
      });
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (e) {
      toast({
        title: "Copy failed",
        description: "Could not copy link to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Extract domain from URL
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url.split('/')[2] || url;
    }
  };

  // Get tracking parameter info
  const getTrackingInfo = (url: string): string => {
    const tracking = findTrackingParam(url);
    return tracking ? tracking.param : 'N/A';
  };

  // Get first clickup payload if available
  const firstOriginalPayload = affiliateLinks.length > 0 ? safeGetPayload(affiliateLinks[0].url) : null;

  return (
    <div className="mt-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            data-testid="button-affiliate-links"
          >
            <Link className="h-3 w-3 mr-1.5" />
            Affiliate Links
            <ChevronDown className="h-3 w-3 ml-1.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[650px] max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">
              Loading links...
            </div>
          ) : error ? (
            <div className="px-3 py-4 text-sm text-destructive flex items-center gap-2 justify-center">
              <AlertCircle className="h-4 w-4" />
              Failed to load affiliate links
            </div>
          ) : affiliateLinks.length === 0 ? (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">
              No affiliate links found in task
            </div>
          ) : (
            <>
              <div className="px-4 py-2.5 border-b sticky top-0 bg-popover z-10">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-foreground">
                    {affiliateLinks.length} Affiliate Link{affiliateLinks.length !== 1 ? 's' : ''}
                  </div>
                  {firstOriginalPayload && (
                    <div className="text-xs text-muted-foreground">
                      Replacing: <span className="font-mono font-semibold">{firstOriginalPayload}</span> → <span className="font-mono font-semibold text-primary">{subIdValue}</span>
                    </div>
                  )}
                </div>
              </div>
              {affiliateLinks.map((linkData, index) => {
                const link = linkData.url;
                const modifiedLink = safeReplacePayload(link, subIdValue);
                const domain = getDomain(link);
                const trackingParam = getTrackingInfo(link);
                const isCopied = copiedUrl === link;
                const displayNumber = linkData.position || (index + 1).toString();
                
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleCopyLink(link)}
                    className="flex items-center gap-3 py-2.5 px-4 cursor-pointer border-b last:border-b-0 hover-elevate active-elevate-2 focus:bg-transparent"
                    data-testid={`menuitem-affiliate-link-${index}`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                      <span className="text-xs font-bold text-primary">{displayNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm font-semibold text-foreground truncate">
                          {linkData.brand || domain}
                        </div>
                        <div className="text-xs px-1.5 py-0.5 rounded bg-muted font-mono text-muted-foreground flex-shrink-0">
                          {trackingParam}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground truncate font-mono">
                        {domain}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {isCopied ? (
                        <div className="flex items-center gap-1.5 text-primary">
                          <Check className="h-4 w-4" />
                          <span className="text-xs font-medium">Copied</span>
                        </div>
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
