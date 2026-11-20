const IMGBB_URL: string = "https://api.imgbb.com/1/upload";
const MAX_SIZE_MB: number = 5;

interface ImgbbResponse {
  success: boolean;
  data?: { url: string; display_url: string };
  error?: { message: string };
}

export const uploadImage = async (file: File): Promise<string> => {
  const apiKey: string | undefined = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("ImgBB API key is missing in .env.local");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image must be smaller than ${MAX_SIZE_MB} MB`);
  }

  const formData = new FormData();
  formData.append("image", file);

  const res: Response = await fetch(`${IMGBB_URL}?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });
  const result: ImgbbResponse | null = await res.json().catch(() => null);

  if (!res.ok || !result?.success || !result.data) {
    throw new Error(result?.error?.message ?? "Image upload failed");
  }

  return result.data.display_url;
};
