"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { useEditorStore } from "@/store/use-editor-store";
import * as Tooltip from "@radix-ui/react-tooltip";

import { googleDocsColors } from "@/app/documents/[documentId]/constants";
import { type Level } from "@tiptap/extension-heading";
import {
  BoldIcon,
  ChevronDownIcon,
  DropletOffIcon,
  HighlighterIcon,
  ItalicIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  PipetteIcon,
  Printer,
  Redo2Icon,
  RemoveFormattingIcon,
  SpellCheckIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";
import { createPortal } from "react-dom";

const EditorTooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string | undefined;
}) => (
  <Tooltip.Provider delayDuration={0}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="bottom"
          sideOffset={8}
          className="z-50 rounded-sm bg-black p-1 text-xs text-white shadow-md animate-fade-in"
        >
          {content}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

const HighlightColorButton = () => {
  const { editor } = useEditorStore();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [tempColor, setTempColor] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const currentHighlight =
    editor?.getAttributes("highlight")?.color || "#ffffff";

  const onSelectColor = (color: string) => {
    editor?.chain().focus().setHighlight({ color }).run();
    setOpen(false);
  };

  const handleEyedropper = async () => {
    try {
      // @ts-expect-error: EyeDropper is not typed in TS by default
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      setTempColor(result.sRGBHex);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (!ref.current?.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <div className="relative" ref={ref}>
        <EditorTooltip content="Highlight">
          <button
            onClick={() => setOpen(!open)}
            className="h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 text-sm px-1.5"
            title="Highlight"
          >
            <HighlighterIcon className="size-4" />
            <div
              className="h-[3px] w-full"
              style={{ backgroundColor: currentHighlight }}
            />
          </button>
        </EditorTooltip>
        {open && (
          <div className="absolute z-50 mt-1 bg-white shadow-md border rounded-md p-3 w-[260px]">
            <button
              onClick={() => {
                editor?.chain().focus().unsetHighlight().run();
                setOpen(false);
              }}
              className="w-full flex text-sm text-left text-gray-700 py-1 px-2 rounded-sm hover:bg-neutral-200/80 mb-2"
            >
              <DropletOffIcon className="size-4" />
              <span className="ml-2">None</span>
            </button>
            <div className="grid grid-cols-10 gap-1">
              {googleDocsColors.map(({ hex, name }) => (
                <button
                  key={hex}
                  title={name}
                  onClick={() => onSelectColor(hex)}
                  className="w-5 h-5 rounded-full border hover:scale-105 transition-transform"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <button
              className="mt-3 text-sm text-left text-gray-500 w-full hover:bg-neutral-200/80 rounded-sm px-1 py-1"
              onClick={() => {
                setTempColor(currentHighlight);
                setCustom(true);
                setOpen(false);
              }}
            >
              CUSTOM
            </button>
          </div>
        )}
      </div>

      {custom &&
        createPortal(
          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-md p-4 border w-fit max-w-[280px]">
            <div className="relative">
              <SketchPicker
                color={tempColor || currentHighlight}
                onChange={(color) => setTempColor(color.hex)}
              />
              <button
                onClick={handleEyedropper}
                className="absolute top-3 right-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-sm rounded-md p-[6px]"
              >
                <PipetteIcon size={16} />
              </button>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setCustom(false)}
                className="px-3 py-1 text-sm border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (tempColor) onSelectColor(tempColor);
                  setCustom(false);
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

const TextColorButton = () => {
  const { editor } = useEditorStore();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [tempColor, setTempColor] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const currentColor =
    editor?.getAttributes("textStyle").color?.toLowerCase() || "#000000";

  const onSelectColor = (color: string) => {
    editor?.chain().setColor(color).run();
    setOpen(false);
  };

  const handleEyedropper = async () => {
    try {
      // @ts-expect-error: EyeDropper is not typed in TS by default
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      setTempColor(result.sRGBHex);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (!ref.current?.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <div className="relative" ref={ref}>
        <EditorTooltip content="Text color">
          <button
            onClick={() => setOpen(!open)}
            className="h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 text-sm px-1.5"
            title="Text color"
          >
            <span className="text-xs">A</span>
            <div
              className="h-[3px] w-full"
              style={{ backgroundColor: currentColor }}
            />
          </button>
        </EditorTooltip>
        {open && (
          <div className="absolute z-50 mt-1 bg-white shadow-md border rounded-md p-3 w-[260px]">
            <div className="grid grid-cols-10 gap-1">
              {googleDocsColors.map(({ hex, name }) => (
                <button
                  key={hex}
                  title={name}
                  onClick={() => onSelectColor(hex)}
                  className="w-5 h-5 rounded-full border hover:scale-105 transition-transform"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <button
              className="mt-3 text-sm text-left text-gray-500 w-full hover:bg-neutral-200/80 rounded-sm px-1 py-1"
              onClick={() => {
                setTempColor(currentColor);
                setCustom(true);
                setOpen(false);
              }}
            >
              CUSTOM
            </button>
          </div>
        )}
      </div>

      {custom &&
        createPortal(
          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-md p-4 border w-fit max-w-[280px]">
            <div className="relative">
              <SketchPicker
                color={tempColor || currentColor}
                onChange={(color) => setTempColor(color.hex)}
              />
              <button
                onClick={handleEyedropper}
                className="absolute top-3 right-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-sm rounded-md p-[6px]"
              >
                <PipetteIcon size={16} />
              </button>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setCustom(false)}
                className="px-3 py-1 text-sm border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (tempColor) onSelectColor(tempColor);
                  setCustom(false);
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

//   const { editor } = useEditorStore();

//   const value = editor?.getAttributes("textStyle").color || "#000000";
//   const onChange = (color: ColorResult) => {
//     editor?.chain().focus().setColor(color.hex).run();
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <button className="h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 text-sm px-1.5 overflow-hidden">
//           <span className="text-xs">A</span>
//           <div className="h-[3px] w-full" style={{ backgroundColor: value }} />
//         </button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="p-3 w-[260px]">
//         <CirclePicker color={value} onChange={onChange} />
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

const HeadingButton = () => {
  const { editor } = useEditorStore();
  const [isOpen, setIsOpen] = useState(false);

  const headings = [
    { label: "Normal text", value: 0, fontSize: "16px" },
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "24px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
  ];

  const getCurrentHeading = () => {
    for (let level = 1; level <= 3; level++) {
      if (editor?.isActive("heading", { level })) {
        return `Heading ${level}`;
      }
    }

    return "Normal text";
  };

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <EditorTooltip content="Styles">
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-7 w-[120px] shrink-0 flex items-center justify-center rounded-sm  text-sm px-1.5 overflow-hidden",
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
              value === 0 && !editor?.isActive("heading") && "bg-[#f1f3f4]",
              value !== 0 &&
                editor?.isActive("heading", { level: value }) &&
                "bg-[#f1f3f4]"
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

const FontFamilyButton = () => {
  const { editor } = useEditorStore();
  const [isOpen, setIsOpen] = useState(false);

  const fonts = [
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Courier New", value: "Courier New, monospace" },
    { label: "Times New Roman", value: "Times New Roman, serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
  ];

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <EditorTooltip content="Font Family">
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-7 w-[91px] shrink-0 flex items-center justify-between rounded-sm  text-sm px-1.5 overflow-hidden",
              isOpen ? "bg-neutral-200/80" : "hover:bg-neutral-200/80"
            )}
          >
            <span className="truncate">
              {editor?.getAttributes("textStyle").fontFamily || "Arial"}
            </span>
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
              editor?.getAttributes("textStyle").fontFamily === value &&
                "bg-[#f1f3f4]"
            )}
            style={{ fontFamily: value }}
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
        tooltip: "Task List",
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
    <div className="bg-[#F0F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 over-flow-x-auto">
      {section[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <FontFamilyButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <HeadingButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      {/* font size */}
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      {section[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <TextColorButton />
      <HighlightColorButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      {section[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      {/* link */}
      {/* image */}
      {/* align */}
      {/* line height */}
      {/* list */}
    </div>
  );
};
