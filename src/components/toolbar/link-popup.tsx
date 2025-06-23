"use client";

import { useEffect, useState } from "react";
import {
  CopyIcon,
  Link2OffIcon,
  PenIcon,
  AlignRightIcon,
  GlobeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, normalizeUrl } from "@/lib/utils";
import { fetchLinkPreview } from "@/lib/fetch-link-preview";

type Props = {
  href: string;
  top: number;
  left: number;
  onClose: () => void;
  onEditLink: (newHref: string) => void;
  onRemoveLink: () => void;
};

export function LinkPopup({
  href,
  top,
  left,
  onClose,
  onEditLink,
  onRemoveLink,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(href);
  const [preview, setPreview] = useState<{
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchLinkPreview(href)
      .then((res) => {
        if (mounted) {
          setPreview(res);
          setLoading(false);
        }
      })
      .catch(() => {
        setPreview(null);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [href]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".link-popup")) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = () => {
    const newHref = normalizeUrl(inputValue);
    if (newHref && newHref !== href) {
      onEditLink(newHref);
    }
    setIsEditing(false);
    onClose();
  };

  const hasPreview = !!(
    preview?.title ||
    preview?.description ||
    preview?.image
  );

  const getTitle = () => {
    if (!preview?.title) return new URL(href).hostname;

    const raw = preview.title.trim();

    const parts = raw.split(/ \| | - | · /);
    if (parts.length > 1) {
      return parts[0];
    }

    return raw;
  };

  function getFaviconElement(
    previewUrl: string | undefined,
    fallbackUrl: string
  ) {
    try {
      const domain = new URL(previewUrl || fallbackUrl).hostname;
      if (domain && domain.includes(".")) {
        return (
          <img
            src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`}
            className="w-5 h-5 object-contain"
            alt="favicon"
          />
        );
      }
    } catch {
      // fail silently
    }

    return (
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        <GlobeIcon className="size-9/2 text-gray-400" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "link-popup absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl w-[400px] max-w-[95vw]",
        "animate-in fade-in zoom-in-95 duration-150 ease-out",
        hasPreview ? "p-4" : "p-3"
      )}
      style={{ top, left }}
    >
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") onClose();
            }}
            className="text-sm h-8"
            autoFocus
          />
          <Button variant="ghost" size="icon" onClick={handleSubmit}>
            <PenIcon className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          {/* Logo + Title + Actions */}
          <div className="flex items-start gap-3 w-full">
            {/* Logo */}
            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent animate-spin rounded-full" />
              ) : (
                getFaviconElement(preview?.url, href)
              )}
            </div>

            {/* Title & Link */}
            <div className="flex flex-col text-blue-600 flex-grow min-w-0">
              <button
                className="text-sm font-semibold  text-left truncate"
                onClick={() => {
                  window.open(href, "_blank");
                  onClose();
                }}
              >
                {getTitle()}
              </button>
              {preview?.title && (
                <span className="text-xs text-gray-900 truncate">{href}</span>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 mt-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  navigator.clipboard.writeText(href);
                  onClose();
                }}
              >
                <CopyIcon className="size-4 text-gray-600 hover:text-black" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  setIsEditing(true);
                  setInputValue(href);
                }}
              >
                <PenIcon className="size-4 text-gray-600 hover:text-black" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  onRemoveLink();
                  onClose();
                }}
              >
                <Link2OffIcon className="size-4 text-gray-600 hover:text-black" />
              </Button>
            </div>
          </div>

          {/* Preview image */}
          {preview?.image && (
            <img
              src={preview.image}
              alt="preview"
              className="max-w-full max-h-48 object-contain rounded-md border bg-white"
            />
          )}

          {/* Description */}
          {preview?.image && preview?.description && (
            <div className="flex items-center gap-2 text-gray-700 mt-1">
              <AlignRightIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <p className="text-xs leading-snug line-clamp-2">
                {preview.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
