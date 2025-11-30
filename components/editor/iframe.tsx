import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, Code } from "lucide-react";

function Iframe() {
  return (
    <div className="space-y-6">
      {/* Form to add iframe */}
      <div className="space-y-4">
        <Input
          className="h-12! block border-0 focus:ring-0 focus:border-0 w-full focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Iframe URL or Embed Code"
        />
        <Input
          className="h-12! block border-0 focus:ring-0 focus:border-0 w-full focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Title (Optional)"
        />
        <Button size={"sm"} className="px-4">
          <Plus className="mr-2" /> Add Iframe
        </Button>
      </div>

      {/* Display Iframe Preview */}
      <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
        <div className="bg-muted p-3 flex items-center gap-2 border-b border-border">
          <Code className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Embedded Content</span>
        </div>
        <div className="aspect-video flex items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Iframe content will be displayed here</p>
        </div>
      </div>
    </div>
  );
}

export default Iframe;








