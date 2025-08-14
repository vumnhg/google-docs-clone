"use client";
import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { EditorTooltip } from "./editor-tooltip";

const FONT_SIZES = ["8", "9", "10", "11", "12", "14", "18", "24", "36", "48"];
const DEFAULT_SIZE = "16";

export const FontSizeButton = ({ editor }: { editor: Editor | null }) => {
  const [fontSize, setFontSize] = useState(DEFAULT_SIZE);
  const [input, setInput] = useState(DEFAULT_SIZE);
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setInput(newSize);
      setIsEditing(false);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const onDocMouse = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsEditing(false);
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", onDocMouse);
    return () => document.removeEventListener("mousedown", onDocMouse);
  }, []);

  useEffect(() => {
    if (!editor) return;
    const syncFromEditor = () => {
      if (isEditing) return;
      const { from, to } = editor.state.selection;
      let size: string | null = null;
      let mixed = false;
      editor.state.doc.nodesBetween(from, to, (node) => {
        const s = node.marks.find((m) => m.type.name === "textStyle")?.attrs
          .fontSize;
        if (s) {
          const px = s.replace("px", "");
          if (size === null) size = px;
          else if (size !== px) mixed = true;
        }
      });
      if (mixed) {
        setFontSize("");
        setInput("");
      } else {
        const finalSize = size || DEFAULT_SIZE;
        setFontSize(finalSize);
        setInput(finalSize);
      }
    };
    editor.on("selectionUpdate", syncFromEditor);
    editor.on("update", syncFromEditor);
    syncFromEditor();
    return () => {
      editor.off("selectionUpdate", syncFromEditor);
      editor.off("update", syncFromEditor);
    };
  }, [editor, isEditing]);

  return (
    <div ref={wrapperRef} className="relative flex items-center gap-x-0.5">
      <EditorTooltip content="Decrease font size">
        <button
          className="h-7 w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80"
          onClick={() =>
            updateFontSize((parseInt(fontSize || DEFAULT_SIZE) - 1).toString())
          }
        >
          -
        </button>
      </EditorTooltip>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateFontSize(input);
            if (e.key === "Escape") {
              setIsEditing(false);
              setShowDropdown(false);
            }
          }}
          className="h-7 w-12 text-sm text-center border border-neutral-400 rounded-sm bg-transparent focus:outline-none focus:ring-0"
        />
      ) : (
        <EditorTooltip content="Font size">
          <button
            className="h-7 w-12 text-sm text-center border border-neutral-400 rounded-sm bg-transparent cursor-text"
            onClick={() => {
              setIsEditing(true);
              setShowDropdown(true);
            }}
          >
            {fontSize}
          </button>
        </EditorTooltip>
      )}

      <EditorTooltip content="Increase font size">
        <button
          className="h-7 w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80"
          onClick={() =>
            updateFontSize((parseInt(fontSize || DEFAULT_SIZE) + 1).toString())
          }
        >
          +
        </button>
      </EditorTooltip>

      {showDropdown && (
        <ul className="absolute top-8 left-1/2 -translate-x-1/2 w-14 bg-white border border-neutral-300 rounded shadow-md z-50">
          {FONT_SIZES.map((s) => (
            <li
              key={s}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => updateFontSize(s)}
              className={`px-2 py-1 text-sm cursor-pointer text-center hover:bg-blue-100 ${
                fontSize === s ? "bg-blue-200" : ""
              }`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
