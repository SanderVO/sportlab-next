"use client";

import { getClientSideURL } from "@/utilities/getURL";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Geen reset token gevonden. Controleer je e-mail link.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Wachtwoorden komen niet overeen.");
            return;
        }

        if (password.length < 8) {
            setError("Wachtwoord moet minimaal 8 tekens lang zijn.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${getClientSideURL()}/api/users/reset-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password, token }),
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
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch {
            setError("Er is een fout opgetreden. Probeer het opnieuw.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center">
                <p className="text-sm text-red-400">{error}</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="space-y-4 text-center">
                <div className="rounded-md bg-green-900/20 border border-green-800 p-4">
                    <p className="text-sm text-green-200">
                        Je wachtwoord is succesvol opnieuw ingesteld. Je wordt
                        zo doorgestuurd naar de inlogpagina.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white/70"
                >
                    Nieuw wachtwoord
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                    placeholder="Minimaal 8 tekens"
                />
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-white/70"
                >
                    Bevestig wachtwoord
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-white/90 disabled:opacity-50"
            >
                {loading ? "Bezig..." : "Wachtwoord opnieuw instellen"}
            </button>
        </form>
    );
}
