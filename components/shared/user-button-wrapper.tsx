// components/shared/user-button-wrapper.tsx
"use client";

import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export function UserButtonWrapper() {
  const { isLoaded, user } = useUser();

  if (!isLoaded || !user) {
    return <div className="size-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  return (
    <UserButton
      appearance={{
        elements: {
          userButtonBox: "size-8",
        },
      }}
    />
  );
}
