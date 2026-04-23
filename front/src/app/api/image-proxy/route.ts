import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return new NextResponse("Missing path parameter", { status: 400 });
    }

    const backendPort = process.env.LESAN_URL?.split(":").pop()?.split("/")[0] || "1406";
    const fullUrl = `http://127.0.0.1:${backendPort}/${path.startsWith("/") ? path.substring(1) : path}`;

    // Fetch the image from the backend
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        // Forward any relevant headers if needed
        "User-Agent": request.headers.get("user-agent") || "Next.js Image Proxy",
      },
      // Add cache control
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch image: ${fullUrl} - Status: ${response.status}`);
      return new NextResponse(`Image not found: ${response.statusText}`, {
        status: response.status,
      });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Length": imageBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error("Image proxy error:", error);
    return new NextResponse(`Failed to fetch image: ${error.message}`, {
      status: 500,
    });
  }
}
