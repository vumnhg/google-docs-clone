"use client";

import { ColorPicker } from "./color-picker";

export const TextColorButton = ({ editor }: { editor: any }) => {
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
