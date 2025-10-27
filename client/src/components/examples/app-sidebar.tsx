import { AppSidebar } from "../app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

const mockWebsites = [
  {
    id: "1",
    name: "E-commerce Store",
    formatPattern: "ABC-{random4digits}-{random3letters}",
    subIdCount: 245,
  },
  {
    id: "2",
    name: "Blog Network",
    formatPattern: "{timestamp}-{rand6chars}",
    subIdCount: 89,
  },
  {
    id: "3",
    name: "Affiliate Hub",
    formatPattern: "RND-{uuidSegment}",
    subIdCount: 512,
  },
];

export default function AppSidebarExample() {
  const [selectedId, setSelectedId] = useState<string | null>("1");

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar
          websites={mockWebsites}
          selectedWebsiteId={selectedId}
          onSelectWebsite={(id) => {
            console.log("Selected website:", id);
            setSelectedId(id);
          }}
          onAddWebsite={() => console.log("Add website clicked")}
        />
      </div>
    </SidebarProvider>
  );
}
