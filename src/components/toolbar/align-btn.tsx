import { useEffect, useState } from "react";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ChevronDownIcon,
} from "lucide-react";
import type { Editor } from "@tiptap/react";
import { EditorTooltip } from "@/components/toolbar/editor-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const alignments = [
  {
    label: "Align Left",
    value: "left",
    icon: AlignLeftIcon,
  },
  {
    label: "Align Center",
    value: "center",
    icon: AlignCenterIcon,
  },
  {
    label: "Align Right",
    value: "right",
    icon: AlignRightIcon,
  },
  {
    label: "Align Justify",
    value: "justify",
    icon: AlignJustifyIcon,
  },
];

export default function AlignButton({ editor }: { editor: Editor | null }) {
  const [currentAlign, setCurrentAlign] = useState<string>("left");

  useEffect(() => {
    if (!editor) return;

    const updateAlign = () => {
      const found = alignments.find(({ value }) =>
        editor.isActive({ textAlign: value })
      );
      setCurrentAlign(found?.value || "left");
    };

    editor.on("transaction", updateAlign);
    return () => {
      editor.off("transaction", updateAlign);
    };
  }, [editor]);

  const CurrentIcon =
    alignments.find((a) => a.value === currentAlign)?.icon || AlignLeftIcon;

  return (
    <DropdownMenu>
      <EditorTooltip content="Align">
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm text-sm px-1.5 overflow-hidden",
              "hover:bg-neutral-200/80"
            )}
          >
            <CurrentIcon className="size-4" />
            <ChevronDownIcon className="size-3 mt-1.5 -ml-1" />
          </button>
        </DropdownMenuTrigger>
      </EditorTooltip>

      <DropdownMenuContent className="p-1 flex gap-y-1">
        {alignments.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => {
              editor?.chain().focus().setTextAlign(value).run();
              setCurrentAlign(value);
            }}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              editor?.isActive({ textAlign: value }) && "bg-neutral-200/80"
            )}
          >
            <EditorTooltip content={label}>
              <Icon className="size-4" />
            </EditorTooltip>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
