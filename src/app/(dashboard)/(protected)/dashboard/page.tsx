import { getMeUser } from "@/utilities/getMeUser";

export default async function DashboardPage() {
    const { user } = await getMeUser({
        nullUserRedirect: "/login",
    });

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900">
                Welkom, {user?.name ?? user?.email}
            </h2>

            <p className="mt-2 text-gray-600">
                Je bent ingelogd als {user?.email}.
            </p>
        </div>
    );
}
