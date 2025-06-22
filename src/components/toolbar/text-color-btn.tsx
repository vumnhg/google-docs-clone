"use client";

import { useEditorStore } from "@/store/use-editor-store";
import { ColorPicker } from "./color-picker";

export const TextColorButton = () => {
  const { editor } = useEditorStore();
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
