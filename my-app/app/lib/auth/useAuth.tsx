"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth(opts?: {
  redirectTo?: string;
  requireAuth?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSession = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("session="));
    if (!hasSession && opts?.requireAuth !== false) {
      const redirectTo = opts?.redirectTo || window.location.pathname;
      const url = new URL("/login", window.location.origin);
      url.searchParams.set("redirectTo", redirectTo);
      router.replace(url.toString());
      return;
    }
    setLoading(false);
  }, [router, opts]);

  return { loading };
}
