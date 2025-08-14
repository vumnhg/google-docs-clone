"use client";

import type { Editor } from "@tiptap/react";
import { EditorTooltip } from "@/components/toolbar/editor-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AlignJustifyIcon, ChevronsUpDownIcon } from "lucide-react";

const lineHeights = [
  { label: "Default", value: "normal" },
  { label: "Single", value: "1" },
  { label: "1.5", value: "1.5" },
  { label: "Double", value: "2" },
];

export const LineHeightButton = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const getCurrentLineHeight = () => {
    const nodeType = editor.state.selection.$from.parent.type.name;
    return editor.getAttributes(nodeType).lineHeight || "normal";
  };

  const currentValue = getCurrentLineHeight();

  return (
    <DropdownMenu>
      <EditorTooltip content="Line height">
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-7 min-w-7 flex items-center justify-center rounded-sm px-1.5 text-sm overflow-hidden",
              "hover:bg-neutral-200/80"
            )}
            aria-label="Change line height"
          >
            <AlignJustifyIcon className="size-4" />
            <ChevronsUpDownIcon className="size-3 ml-0.5" />
          </button>
        </DropdownMenuTrigger>
      </EditorTooltip>

      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {lineHeights.map(({ label, value }) => {
          const isActive = currentValue === value;
          return (
            <button
              key={value}
              onClick={() => editor.chain().focus().setLineHeight(value).run()}
              className={cn(
                "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                isActive && "bg-neutral-300"
              )}
            >
              <span className="text-sm">{label}</span>
            </button>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
