"use client";

import type { Editor } from "@tiptap/react";
import { ColorPicker } from "./color-picker";

export const TextColorButton = ({ editor }: { editor: Editor | null }) => {
  const currentColor =
    editor?.getAttributes("textStyle").color?.toLowerCase() || "#000000";

  return (
    <ColorPicker
      tooltip="Text color"
      currentColor={currentColor}
      onColorSelect={(color) => editor?.chain().setColor(color).run()}
    />
  );
};
