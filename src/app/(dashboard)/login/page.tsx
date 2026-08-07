import { getMeUser } from "@/utilities/getMeUser";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
    // Redirect already-authenticated users straight to dashboard
    await getMeUser({
        validUserRedirect: "/dashboard",
    });

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-lg border border-sand/10 bg-ink p-8 shadow-lg shadow-ink/30">
                <h1 className="mb-6 text-2xl font-bold text-warm-white">
                    Inloggen
                </h1>

                <LoginForm />
            </div>
        </div>
    );
}
