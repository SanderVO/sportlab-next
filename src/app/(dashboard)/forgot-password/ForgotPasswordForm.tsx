"use client";

import { getClientSideURL } from "@/utilities/getURL";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(
                `${getClientSideURL()}/api/users/forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                },
            );

            if (!res.ok) {
                const data: { errors?: { message: string }[] } =
                    await res.json();
                setError(
                    data?.errors?.[0]?.message ??
                        "Er is een fout opgetreden. Probeer het opnieuw.",
                );
                return;
            }

            setSuccess(true);
            setEmail("");
        } catch {
            setError("Er is een fout opgetreden. Probeer het opnieuw.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="space-y-4">
                <div className="rounded-md border border-olive/40 bg-olive/20 p-4">
                    <p className="text-sm text-warm-white">
                        Als dit e-mailadres in ons systeem bestaat, ontvang je
                        zo een link om je wachtwoord opnieuw in te stellen.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="block text-center text-sm text-sand/70 hover:text-warm-white"
                >
                    Terug naar inloggen
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-sand/70"
                >
                    E-mailadres
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-sand/10 bg-charcoal px-3 py-2 text-sm text-warm-white placeholder:text-sand/30 focus:border-cta/50 focus:outline-none focus:ring-1 focus:ring-cta/30"
                />
            </div>

            {error && <p className="text-sm text-cta">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-cta px-4 py-2 text-sm font-medium text-ink hover:bg-cta/90 disabled:opacity-50"
            >
                {loading ? "Bezig..." : "Verstuur reset link"}
            </button>

            <Link
                href="/login"
                className="block text-center text-sm text-sand/70 hover:text-warm-white"
            >
                Terug naar inloggen
            </Link>
        </form>
    );
}
