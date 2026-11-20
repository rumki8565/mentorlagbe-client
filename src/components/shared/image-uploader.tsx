"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/upload-image";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  shape?: "banner" | "avatar";
}

export default function ImageUploader({
  value,
  onChange,
  shape = "banner",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const isAvatar: boolean = shape === "avatar";

  const handleFile = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file: File | undefined = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const url: string = await uploadImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={isAvatar ? "flex items-center gap-5" : "space-y-3"}>
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-dashed border-slate-300 bg-slate-50 ${
          isAvatar ? "h-24 w-24 rounded-full" : "h-44 w-full rounded-xl"
        }`}
      >
        {value ? (
          <Image
            src={value}
            alt="Preview"
            fill
            unoptimized
            className="object-cover"
          />
        ) : isAvatar ? (
          <User className="h-8 w-8 text-slate-400" />
        ) : (
          <div className="text-center text-sm text-slate-400">
            <ImagePlus className="mx-auto mb-1 h-8 w-8" />
            No image selected
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        )}
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading..." : value ? "Change Image" : "Choose Image"}
        </Button>
        <p className="mt-2 text-xs text-slate-500">
          PNG, JPG or WebP, up to 5 MB.
        </p>
      </div>
    </div>
  );
}
