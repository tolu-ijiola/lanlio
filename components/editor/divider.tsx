import React from "react";
import { Separator } from "../ui/separator";

interface DividerProps {
  data: any;
}

function Divider({ data }: DividerProps) {
  return (
    <div className="py-4 w-full">
      <hr
        style={{
          borderColor: data.color || "#e2e8f0",
          borderTopWidth: data.thickness || "1px",
          borderStyle: data.style || "solid",
        }}
        className="w-full"
      />
    </div>
  );
}

export default Divider;













