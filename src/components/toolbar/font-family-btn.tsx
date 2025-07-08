"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { EditorTooltip } from "./editor-tooltip";
import { cn } from "@/lib/utils";

export const FontFamilyButton = ({ editor }: { editor: Editor | null }) => {
  const [isOpen, setIsOpen] = useState(false);

  const fonts = [
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Courier New", value: "Courier New, monospace" },
    { label: "Times New Roman", value: "Times New Roman, serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
  ];

  const currentFont =
    editor?.getAttributes("textStyle").fontFamily || "Arial, sans-serif";

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <EditorTooltip content="Font Family">
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-7 w-[91px] shrink-0 flex items-center justify-between rounded-sm text-sm px-1.5 overflow-hidden",
              isOpen ? "bg-neutral-200/80" : "hover:bg-neutral-200/80"
            )}
          >
            <span className="truncate">{currentFont}</span>
            <ChevronDownIcon className="ml-2 size-4 shrink-0" />
          </button>
        </DropdownMenuTrigger>
      </EditorTooltip>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {fonts.map(({ label, value }) => (
          <button
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              currentFont === value && "bg-[#f1f3f4]"
            )}
            style={{ fontFamily: value }}
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
          >
            {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
