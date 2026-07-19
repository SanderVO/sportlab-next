import { getMeUser } from "@/utilities/getMeUser";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
    // Redirect already-authenticated users straight to dashboard
    await getMeUser({
        validUserRedirect: "/dashboard",
    });

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-lg bg-[#111111] border border-white/10 p-8">
                <h1 className="mb-6 text-2xl font-bold text-white">Inloggen</h1>

                <LoginForm />
            </div>
        </div>
    );
}
