"use client";

import { useEffect, useState } from "react";
import {
  LucideIcon,
  Undo2Icon,
  Redo2Icon,
  Printer,
  SpellCheckIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  MessageSquarePlusIcon,
  ListTodoIcon,
  RemoveFormattingIcon,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { useEditorStore } from "@/store/use-editor-store";

import { EditorTooltip } from "@/components/toolbar/editor-tooltip";
import { FontFamilyButton } from "@/components/toolbar/font-family-btn";
import { HighlightColorButton } from "@/components/toolbar/highlight-color-btn";
import { HeadingButton } from "@/components/toolbar/heading-btn";
import { LinkButton } from "@/components/toolbar/link-btn";
import { TextColorButton } from "@/components/toolbar/text-color-btn";
import ImageButton from "@/components/toolbar/image-btn";

import { cn } from "@/lib/utils";
import { AlignButton } from "@/components/toolbar/align-btn";
import { ListButton } from "@/components/toolbar/list-btn";
import { FontSizeButton } from "@/components/toolbar/font-size-btn";
import { LineHeightButton } from "@/components/toolbar/line-height-btn";

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
  tooltip?: string;
}

const ToolbarButton = ({
  onClick,
  isActive,
  tooltip,
  icon: Icon,
}: ToolbarButtonProps) => {
  return (
    <EditorTooltip content={tooltip}>
      <button
        onClick={onClick}
        title={tooltip}
        className={cn(
          "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm  transition-colors duration-150 ease-in-out",
          isActive ? "bg-[#d2e3fc] " : "hover:bg-neutral-200/80"
        )}
      >
        <Icon className="size-4" />
      </button>
    </EditorTooltip>
  );
};

export const Toolbar = () => {
  const { editor } = useEditorStore();

  const [spellCheckEnabled, setSpellCheckEnabled] = useState(true);

  useEffect(() => {
    if (editor?.view.dom) {
      editor.view.dom.setAttribute("spellcheck", spellCheckEnabled.toString());
      editor.view.dom.setAttribute("lang", "en");
    }
  }, [editor, spellCheckEnabled]);

  const section: {
    label: string;
    icon: LucideIcon;
    tooltip?: string;
    onClick?: () => void;
    isActive?: boolean;
  }[][] = [
    [
      {
        label: "Undo",
        icon: Undo2Icon,
        tooltip: "Undo (Ctrl+Z)",
        onClick: () => editor?.chain().focus().undo().run(),
      },
      {
        label: "Redo",
        icon: Redo2Icon,
        tooltip: "Redo (Ctrl+Y)",
        onClick: () => editor?.chain().focus().redo().run(),
      },
      {
        label: "Print",
        icon: Printer,
        tooltip: "Print (Ctrl+P)",
        onClick: () => window.print(),
      },
      {
        label: "Spell Check",
        icon: SpellCheckIcon,
        tooltip: spellCheckEnabled
          ? "Disable Spell Check"
          : "Enable Spell Check",
        onClick: () => setSpellCheckEnabled((prev) => !prev),
        isActive: spellCheckEnabled,
      },
    ],
    [
      {
        label: "Bold",
        icon: BoldIcon,
        tooltip: "Bold (Ctrl+B)",
        isActive: editor?.isActive("bold"),
        onClick: () => editor?.chain().focus().toggleBold().run(),
      },
      {
        label: "Italic",
        icon: ItalicIcon,
        tooltip: "Italic (Ctrl+I)",
        isActive: editor?.isActive("italic"),
        onClick: () => editor?.chain().focus().toggleItalic().run(),
      },
      {
        label: "Underline",
        icon: UnderlineIcon,
        tooltip: "Underline (Ctrl+U)",
        isActive: editor?.isActive("underline"),
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
      },
    ],
    [
      {
        label: "Comment",
        icon: MessageSquarePlusIcon,
        tooltip: "Comment",
        onClick: () => console.log("comment"),
      },
      {
        label: "List",
        icon: ListTodoIcon,
        tooltip: "Check List",
        isActive: editor?.isActive("taskList"),
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
      },
      {
        label: "Remove Formatting",
        icon: RemoveFormattingIcon,
        tooltip: "Clear Formatting",
        onClick: () => editor?.chain().focus().unsetAllMarks().run(),
      },
    ],
  ];

  return (
    <div className="bg-[#F0F4F9] px-2.5 py-0.5 rounded-[24px] w-[1232px] min-h-[40px] flex items-center gap-x-0.5">
      {section[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <FontFamilyButton editor={editor} />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <HeadingButton editor={editor} />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <FontSizeButton editor={editor} />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      {section[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <TextColorButton editor={editor} />
      <HighlightColorButton editor={editor} />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      {section[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <LinkButton editor={editor} />
      <ImageButton editor={editor} />
      <AlignButton editor={editor} />
      <LineHeightButton editor={editor} />
      <ListButton editor={editor} />
    </div>
  );
};
