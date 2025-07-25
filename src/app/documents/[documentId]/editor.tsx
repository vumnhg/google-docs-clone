"use client";
import { useState } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import FontFamily from "@tiptap/extension-font-family";
// import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

import { useEditorStore } from "./../../../store/use-editor-store";
import { LinkPopup } from "@/components/toolbar/link-popup";

function Editor() {
  const { setEditor } = useEditorStore();
  const [linkInfo, setLinkInfo] = useState<{
    href: string;
    top: number;
    left: number;
  } | null>(null);

  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        spellcheck: "false",
        style: "padding-left: 56px; padding-right: 56px;",
        class:
          "focus:outline-none min-h-[1054px] w-[816px] bg-white border border-[C7C7C7] flex flex-col pt-10 pr-14 pb-10 cursor-text print:border-0",
      },
      handleClickOn(view, pos, node, nodePos, event) {
        const el = event.target as HTMLElement;
        const linkEl = el.closest("a");

        if (linkEl) {
          const href = linkEl.getAttribute("href") ?? "";
          const rect = linkEl.getBoundingClientRect();

          setLinkInfo({
            href,
            top: rect.bottom + window.scrollY + 6,
            left: rect.left + window.scrollX,
          });

          return true;
        }

        return false;
      },
    },
    extensions: [
      Color.configure({
        types: ["textStyle", "heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        autolink: true,
        openOnClick: false,
        linkOnPaste: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      FontFamily,
      // Image,
      ImageResize,
      StarterKit.configure({
        dropcursor: {},
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TaskList,
      TableCell,
      TableHeader,
      TableRow,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Underline,
    ],
    content: `
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
          </tbody>
        </table>
        <p>google</p>
      `,
    immediatelyRender: false,
  });

  return (
    <div className="size-full bg-[#F9FBFD] overflow-x-auto px-4 print:p-0 print:bg-white print:overflow-visible">
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
        {linkInfo && (
          <LinkPopup
            href={linkInfo.href}
            top={linkInfo.top}
            left={linkInfo.left}
            onClose={() => setLinkInfo(null)}
            onEditLink={(newHref) => {
              editor
                ?.chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: newHref })
                .run();
            }}
            onRemoveLink={() => {
              editor?.chain().focus().extendMarkRange("link").unsetLink().run();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Editor;
