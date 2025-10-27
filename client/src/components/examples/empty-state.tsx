import { EmptyState } from "../empty-state";

export default function EmptyStateExample() {
  return (
    <div className="h-screen">
      <EmptyState onAddWebsite={() => console.log("Add website clicked")} />
    </div>
  );
}
