
import { redirect } from "next/navigation";

import { getAuthenticatedUser } from
    "@/features/auth/server/auth.session";

import { AdminRequests } from
    "@/features/account-requests/admin-requests";

export default async function AdminRequestsPage() {
    const user = await getAuthenticatedUser();

    if (!user) {
        redirect("/login?next=/dashboard");
    }

    if (user.role !== "SUPER_ADMIN") {
        redirect("/dashboard");
    }

    return <AdminRequests />;
}
