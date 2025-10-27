import { WebsiteHeader } from "../website-header";

export default function WebsiteHeaderExample() {
  return (
    <div className="p-8 max-w-4xl">
      <WebsiteHeader
        websiteName="E-commerce Store"
        formatPattern="ABC-{random4digits}-{random3letters}"
        subIdCount={245}
        onGenerateId={() => console.log("Generate ID clicked")}
        onDeleteWebsite={() => console.log("Delete website clicked")}
      />
    </div>
  );
}
