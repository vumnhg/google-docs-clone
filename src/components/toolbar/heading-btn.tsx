"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { EditorTooltip } from "./editor-tooltip";
import { cn } from "@/lib/utils";
import { type Level } from "@tiptap/extension-heading";

export const HeadingButton = ({ editor }: { editor: Editor | null }) => {
  const [isOpen, setIsOpen] = useState(false);

  const headings = [
    { label: "Normal text", value: 0, fontSize: "16px" },
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "24px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
  ];
  const len = headings.length;

  const getCurrentHeading = () => {
    for (let level = 1; level <= len - 1; level++) {
      if (editor?.isActive("heading", { level })) {
        return `Heading ${level}`;
      }
    }
    return "Normal text";
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <EditorTooltip content="Styles">
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-7 w-[120px] shrink-0 flex items-center justify-center rounded-sm text-sm px-1.5 overflow-hidden",
              isOpen ? "bg-neutral-200/80" : "hover:bg-neutral-200/80"
            )}
          >
            <span className="truncate">{getCurrentHeading()}</span>
            <ChevronDownIcon className="ml-2 size-4 shrink-0" />
          </button>
        </DropdownMenuTrigger>
      </EditorTooltip>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {headings.map(({ label, value, fontSize }) => (
          <button
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              label === getCurrentHeading() && "bg-[#f1f3f4]"
            )}
            style={{ fontSize }}
            onClick={() => {
              if (value === 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: value as Level })
                  .run();
              }
            }}
          >
            {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
