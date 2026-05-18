"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { remove } from "@/app/actions/warCriminal/remove";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteWarCriminalButton({ id, confirmMessage }: { id: string; confirmMessage: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(confirmMessage)) return;
    setIsDeleting(true);
    try {
      await remove({ _id: id }, { _id: 1 });
      router.push("/admin/war-criminals");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete war criminal:", error);
      setIsDeleting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      className="bg-crimson/20 text-crimson-light hover:bg-crimson/30 border border-crimson/30"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="me-2 h-4 w-4" />
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
