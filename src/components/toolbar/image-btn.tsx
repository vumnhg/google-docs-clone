import { useState } from "react";
import { ImageIcon, Link2Icon, UploadIcon, XIcon } from "lucide-react";
import type { Editor } from "@tiptap/react";
import { EditorTooltip } from "@/components/toolbar/editor-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ImageButton({ editor }: { editor: Editor | null }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [hasError, setHasError] = useState(false);
  const [step, setStep] = useState<"input" | "preview">("input");

  const resetInputStep = () => {
    setStep("input");
    setImageUrl("");
    setHasError(false);
  };

  const resetDialog = () => {
    resetInputStep();
    setIsDialogOpen(false);
  };

  const tryLoadImage = () => {
    const url = imageUrl.trim();
    if (!url) return;
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setHasError(false);
      setStep("preview");
    };
    img.onerror = () => {
      setHasError(true);
      setStep("input");
    };
  };

  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
      }
    };
    input.click();
  };

  const handleInsert = () => {
    onChange(imageUrl.trim());
    resetDialog();
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-0 overflow-hidden">
          {step === "preview" ? (
            <div className="relative w-full bg-white">
              <button
                className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow"
                onClick={resetInputStep}
              >
                <XIcon className="size-4" />
              </button>
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-auto object-scale-down block"
              />
              <div className="flex justify-end gap-2 px-4 py-3">
                <Button variant="ghost" onClick={resetDialog}>
                  Cancel
                </Button>
                <Button onClick={handleInsert}>Insert</Button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <DialogHeader>
                <DialogTitle>Insert image URL</DialogTitle>
              </DialogHeader>

              <div className="mt-4 flex flex-col gap-1">
                <Input
                  className="border-0 rounded-none border-b-2 border-[#5e97f6] focus-visible:ring-0 focus-visible:outline-none px-0 text-xs"
                  placeholder="Paste URL of image..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setHasError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") tryLoadImage();
                  }}
                />

                {hasError && (
                  <p className="text-[11px] text-red-500 mt-1">
                    We can&apos;t find or access the image at that URL.
                  </p>
                )}

                <DialogDescription className="text-[10px] text-muted-foreground">
                  Only select images that you have confirmed that you have the
                  license to use.
                </DialogDescription>
              </div>

              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={resetDialog}>
                  Cancel
                </Button>
                <Button onClick={tryLoadImage} disabled={!imageUrl.trim()}>
                  Preview
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <EditorTooltip content="Insert image">
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm text-sm px-1.5 overflow-hidden",
                "hover:bg-neutral-200/80"
              )}
            >
              <ImageIcon className="size-4" />
            </button>
          </DropdownMenuTrigger>
        </EditorTooltip>
        <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
          <DropdownMenuItem onClick={onUpload}>
            <UploadIcon className="size-4 mr-2" />
            Upload from computer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              resetInputStep();
              setIsDialogOpen(true);
            }}
          >
            <Link2Icon className="size-4 mr-2" />
            By URL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
