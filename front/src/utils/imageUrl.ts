/**
 * Utility function to generate image URLs that work both on client and server side
 * Uses the backend URL for images since they're served from the backend service
 */

export const getImageUrl = (path: string): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : `http://localhost:3000`);

  return `${baseUrl}/api/image-proxy?path=${encodeURIComponent(path)}`;
};

/**
 * Specific function for image uploads
 */
export const getImageUploadUrl = (
  filename: string,
  type: "image" | "video" | "docs" = "image",
): string => {
  const folder = type === "image" ? "images" : type === "video" ? "videos" : "docs";
  return getImageUrl(`uploads/${folder}/${filename}`);
};
