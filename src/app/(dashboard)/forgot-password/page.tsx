import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-lg border border-sand/10 bg-ink p-8 shadow-lg shadow-ink/30">
                <h1 className="mb-2 text-2xl font-bold text-warm-white">
                    Wachtwoord vergeten?
                </h1>

                <p className="mb-6 text-sm text-sand/60">
                    Voer je e-mailadres in en we sturen je een link om je
                    wachtwoord opnieuw in te stellen.
                </p>

                <ForgotPasswordForm />
            </div>
        </div>
    );
}
