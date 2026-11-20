
import { redirect } from "next/navigation";

import { getAuthenticatedUser } from
    "@/features/auth/server/auth.session";

import { accountRequestRepository } from
    "@/features/account-requests/account-request.repository";

import { AccessRequestPanel } from
    "@/features/account-requests/access-request-panel";

export default async function AccessPage() {
    const user = await getAuthenticatedUser();

    if (!user) {
        redirect("/login?next=/dashboard");
    }

    if (user.role === "SUPER_ADMIN") {
        redirect("/admin");
    }

    const request =
        await accountRequestRepository.findMine(user.id);

    if (request?.status === "APPROVED") {
        redirect("/dashboard");
    }

    return (
        <AccessRequestPanel
            initialRequest={
                request
                    ? {
                        status: request.status,
                        websiteUrl: request.websiteUrl,
                        reviewNote: request.reviewNote,
                    }
                    : null
            }
        />
    );
}
