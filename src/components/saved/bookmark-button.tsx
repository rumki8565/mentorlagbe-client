"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSaved } from "@/components/saved/saved-provider";

interface BookmarkButtonProps {
  tuitionId: string;
  variant?: "icon" | "full";
}

export default function BookmarkButton({
  tuitionId,
  variant = "icon",
}: BookmarkButtonProps) {
  const { canSave, ready, isSaved, toggle } = useSaved();
  const [busy, setBusy] = useState<boolean>(false);

  // Only students can save tuitions
  if (!canSave) {
    return null;
  }

  const saved: boolean = isSaved(tuitionId);

  const handleClick = async (): Promise<void> => {
    setBusy(true);
    await toggle(tuitionId);
    setBusy(false);
  };

  if (variant === "full") {
    return (
      <Button
        type="button"
        variant="outline"
        disabled={!ready || busy}
        onClick={handleClick}
        className="w-full"
      >
        <Bookmark
          className={`mr-2 h-4 w-4 ${saved ? "fill-indigo-600 text-indigo-600" : ""}`}
        />
        {saved ? "Saved" : "Save Tuition"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from saved tuitions" : "Save tuition"}
      disabled={!ready || busy}
      onClick={handleClick}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow transition hover:text-indigo-600 disabled:opacity-60"
    >
      <Bookmark
        className={`h-4 w-4 ${saved ? "fill-indigo-600 text-indigo-600" : ""}`}
      />
    </button>
  );
}
