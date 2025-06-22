"use client";

import * as Tooltip from "@radix-ui/react-tooltip";

interface EditorTooltipProps {
  children: React.ReactNode;
  content: string | undefined;
}

export const EditorTooltip = ({ children, content }: EditorTooltipProps) => (
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
