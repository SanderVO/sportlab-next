import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-lg bg-[#111111] border border-white/10 p-8">
                <h1 className="mb-2 text-2xl font-bold text-white">
                    Wachtwoord vergeten?
                </h1>

                <p className="mb-6 text-sm text-white/60">
                    Voer je e-mailadres in en we sturen je een link om je
                    wachtwoord opnieuw in te stellen.
                </p>

                <ForgotPasswordForm />
            </div>
        </div>
    );
}
