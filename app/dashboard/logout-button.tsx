"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      className="h-10 rounded-xl px-4"
      disabled={isLoggingOut}
      onClick={handleLogout}
      type="button"
      variant="outline"
    >
      {isLoggingOut ? "Logging out..." : "Log out"}
    </Button>
  );
}
