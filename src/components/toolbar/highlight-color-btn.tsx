"use client";

import { HighlighterIcon } from "lucide-react";
import { ColorPicker } from "./color-picker";

export const HighlightColorButton = ({ editor }: { editor: any }) => {
  const currentHighlight =
    editor?.getAttributes("highlight")?.color || "#ffffff";

  return (
    <ColorPicker
      tooltip="Highlight"
      currentColor={currentHighlight}
      onColorSelect={(color) =>
        editor?.chain().focus().setHighlight({ color }).run()
      }
      onUnset={() => editor?.chain().focus().unsetHighlight().run()}
      icon={<HighlighterIcon className="size-4" />}
    />
  );
};
