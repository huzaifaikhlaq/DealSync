
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function handleLogout() {
        if (pending) return;

        setPending(true);

        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "same-origin",
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            router.replace("/login");
            router.refresh();
        } catch {
            window.alert("Unable to sign out. Please try again.");
            setPending(false);
        }
    }

    return (
        <button
            type="button"
            className="sidebar-logout-button"
            aria-busy={pending}
            disabled={pending}
            onClick={handleLogout}
        >
            <LogOut size={18} aria-hidden="true" />
            <span>{pending ? "Signing out…" : "Sign out"}</span>
        </button>
    );
}
