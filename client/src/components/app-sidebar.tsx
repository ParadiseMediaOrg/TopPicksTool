import { Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface Website {
  id: string;
  name: string;
  formatPattern: string;
  subIdCount: number;
}

interface AppSidebarProps {
  websites: Website[];
  selectedWebsiteId: string | null;
  onSelectWebsite: (id: string) => void;
  onAddWebsite: () => void;
}

export function AppSidebar({
  websites,
  selectedWebsiteId,
  onSelectWebsite,
  onAddWebsite,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-sm font-semibold">ID</span>
          </div>
          <h1 className="text-lg font-semibold">Sub-ID Tracker</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Websites</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {websites.map((website) => (
                <SidebarMenuItem key={website.id}>
                  <SidebarMenuButton
                    isActive={selectedWebsiteId === website.id}
                    onClick={() => onSelectWebsite(website.id)}
                    data-testid={`button-select-website-${website.id}`}
                  >
                    <div className="flex flex-col items-start gap-1 overflow-hidden">
                      <span className="font-medium truncate w-full">{website.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {website.subIdCount} IDs
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          onClick={onAddWebsite}
          className="w-full"
          data-testid="button-add-website"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Website
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
