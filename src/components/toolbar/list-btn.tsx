import { useEffect, useState } from "react";
import { ChevronDownIcon, ListIcon, ListOrderedIcon } from "lucide-react";
import type { Editor } from "@tiptap/react";
import { EditorTooltip } from "@/components/toolbar/editor-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ListType = "bulletedList" | "orderedList";

const LIST_OPTIONS: {
  label: string;
  value: ListType;
  icon: LucideIcon;
  isActive: (editor: Editor | null) => boolean;
  onClick: (editor: Editor | null) => void;
}[] = [
  {
    label: "Bulleted List",
    value: "bulletedList",
    icon: ListIcon,
    isActive: (editor) => editor?.isActive("bulletedList") || false,
    onClick: (editor) => editor?.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Ordered List",
    value: "orderedList",
    icon: ListOrderedIcon,
    isActive: (editor) => editor?.isActive("orderedList") || false,
    onClick: (editor) => editor?.chain().focus().toggleOrderedList().run(),
  },
];

export default function ListButton({ editor }: { editor: Editor | null }) {
  const [list, setList] = useState<"bulletedList" | "orderedList">(
    "bulletedList"
  );

  useEffect(() => {
    if (!editor) return;

    const updateList = () => {
      const found = LIST_OPTIONS.find(({ value }) => editor.isActive(value));
      setList(found?.value || "bulletedList");
    };

    editor.on("transaction", updateList);
    return () => {
      editor.off("transaction", updateList);
    };
  }, [editor]);

  const CurrentIcon =
    LIST_OPTIONS.find((item) => item.value === list)?.icon || ListIcon;

  return (
    <DropdownMenu>
      <EditorTooltip content="List Type">
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-7 min-w-7 flex items-center justify-center rounded-sm text-sm px-1.5",
              "hover:bg-neutral-200/80"
            )}
          >
            <CurrentIcon className="size-4" />
            <ChevronDownIcon className="size-3 mt-1.5 -ml-1" />
          </button>
        </DropdownMenuTrigger>
      </EditorTooltip>

      <DropdownMenuContent className="p-1 flex gap-y-1 min-w-7">
        {LIST_OPTIONS.map(({ label, icon: Icon, onClick, isActive }) => (
          <button
            key={label}
            onClick={() => onClick(editor)}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              isActive(editor) && "bg-neutral-200/80"
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
