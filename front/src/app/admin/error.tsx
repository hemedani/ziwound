"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Admin Panel Error
          </CardTitle>
          <CardDescription>
            An unexpected error occurred in the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground text-left overflow-auto max-h-32">
            <p className="font-mono text-xs break-words">
              {error.message || "Unknown error occurred."}
            </p>
            {error.digest && (
              <p className="font-mono text-xs mt-2">Error ID: {error.digest}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard">Dashboard</Link>
          </Button>
          <Button onClick={() => reset()}>
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
