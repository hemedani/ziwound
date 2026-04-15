"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getMe } from "@/app/actions/user/getMe";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setToken } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const initializeAuth = async () => {
      try {
        const result = await getMe();

        if (result.success && result.body) {
          // @ts-ignore - mapping backend user level to store user level if needed
          setUser(result.body);
          setToken("authenticated");
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
        setUser(null);
        setToken(null);
      }
    };

    initializeAuth();
  }, [setUser, setToken]);

  // Optionally, you can return a loading state here if you want to block rendering
  // until auth state is known, but returning children directly prevents SSR hydration mismatches
  return <>{children}</>;
}
