import { NextRequest } from "next/server";

export const maxDuration = 60; // Set max duration to 60 seconds
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get the server-side environment variable
    const backendUrl = process.env.LESAN_URL || "http://localhost:1406";
    const fullUrl = `${backendUrl}/lesan`;

    // Get the authorization token from cookies or headers
    const authHeader = request.headers.get("authorization") || request.headers.get("token");
    const cookieHeader = request.headers.get("cookie");

    // Check if this is a multipart request (for file uploads)
    const contentType = request.headers.get("content-type");
    let requestBody: BodyInit;
    const headers: Record<string, string> = {};

    if (contentType && contentType.includes("multipart/form-data")) {
      // For multipart requests (file uploads), pass the raw body directly
      // This preserves the boundary and multipart structure
      const blob = await request.blob();
      requestBody = blob;

      // Extract boundary from content-type header and pass it along
      const boundary = contentType.split("boundary=")[1];
      if (boundary) {
        headers["Content-Type"] = `multipart/form-data; boundary=${boundary}`;
      } else {
        // Fallback: let fetch handle it
        headers["Content-Type"] = contentType;
      }
    } else {
      // For regular JSON requests
      const body = await request.json();
      requestBody = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
    }

    // Add authentication header if present
    if (authHeader) {
      headers["token"] = authHeader;
    }

    // Add cookie header if present
    if (cookieHeader) {
      headers["cookie"] = cookieHeader;
    }

    // Forward the request to the backend service with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 second timeout

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers,
        body: requestBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Get the response body
      let responseData;
      const responseContentType = response.headers.get("content-type");

      if (responseContentType && responseContentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        // For non-JSON responses (like file uploads), get text response
        responseData = await response.text();

        // Try to parse as JSON if possible, otherwise return as text
        try {
          responseData = JSON.parse(responseData);
        } catch {
          // If it's not valid JSON, return as text
          responseData = { success: true, body: responseData };
        }
      }

      return new Response(JSON.stringify(responseData), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === "AbortError") {
        console.error("Proxy timeout error");
        return new Response(
          JSON.stringify({
            success: false,
            body: { message: "Request timeout - file might be too large" },
          }),
          {
            status: 504,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      throw fetchError;
    }
  } catch (error: any) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        body: {
          message: "Proxy request failed",
          error: error.message || "Unknown error",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
