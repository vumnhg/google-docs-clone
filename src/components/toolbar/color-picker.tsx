"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SketchPicker } from "react-color";
import { DropletOffIcon, PipetteIcon } from "lucide-react";
import { googleDocsColors } from "@/constants/index";
import { EditorTooltip } from "./editor-tooltip";

interface ColorPickerButtonProps {
  icon?: React.ReactNode;
  tooltip: string;
  currentColor: string;
  onColorSelect: (color: string) => void;
  onUnset?: () => void;
  customLabel?: string;
}
interface EyeDropperConstructor {
  new (): EyeDropper;
}
interface EyeDropper {
  open(): Promise<{ sRGBHex: string }>;
}
declare const EyeDropper: EyeDropperConstructor;

export const ColorPicker = ({
  icon,
  tooltip,
  currentColor,
  onColorSelect,
  onUnset,
  customLabel = "CUSTOM",
}: ColorPickerButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [tempColor, setTempColor] = useState<string | null>(null);

  const handleEyedropper = async () => {
    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      setTempColor(result.sRGBHex);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (!ref.current?.contains(e.target as Node)) setOpen(false);
  };

  useEffect(() => {
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <div className="relative" ref={ref}>
        <EditorTooltip content={tooltip}>
          <button
            onClick={() => setOpen(!open)}
            className="h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 text-sm px-1.5"
            title={tooltip}
          >
            {icon || <span className="text-xs">A</span>}
            <div
              className="h-[3px] w-full"
              style={{ backgroundColor: currentColor }}
            />
          </button>
        </EditorTooltip>
        {open && (
          <div className="absolute z-50 mt-1 bg-white shadow-md border rounded-md p-3 w-[260px]">
            {onUnset && (
              <button
                onClick={() => {
                  onUnset();
                  setOpen(false);
                }}
                className="w-full flex text-sm text-left text-gray-700 py-1 px-2 rounded-sm hover:bg-neutral-200/80 mb-2"
              >
                <DropletOffIcon className="size-4" />
                <span className="ml-2">None</span>
              </button>
            )}
            <div className="grid grid-cols-10 gap-1">
              {googleDocsColors.map(({ hex, name }) => (
                <button
                  key={hex}
                  title={name}
                  onClick={() => {
                    onColorSelect(hex);
                    setOpen(false);
                  }}
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
              {customLabel}
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
                  if (tempColor) onColorSelect(tempColor);
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
