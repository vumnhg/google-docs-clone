"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EditorTooltip } from "./editor-tooltip";
import { Button } from "../ui/button";
import { normalizeUrl } from "@/lib/utils";

export function LinkButton({ editor }: { editor: any }) {
  const [value, setValue] = useState("");

  const onApply = () => {
    const href = normalizeUrl(value);
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setValue("");
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          const currentHref = editor?.getAttributes("link")?.href || "";
          setValue(currentHref);
        }
      }}
    >
      <EditorTooltip content="Insert link">
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm text-sm px-1.5 overflow-hidden",
              editor?.isActive("link")
                ? "bg-neutral-200/80"
                : "hover:bg-neutral-200/80"
            )}
          >
            <Link2Icon className="size-4" />
          </button>
        </DropdownMenuTrigger>
      </EditorTooltip>

      <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
        <Input
          value={value}
          placeholder="Paste or type a link..."
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onApply()}
          className="text-sm"
          autoFocus
        />
        <Button onClick={onApply}>Apply</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
