"use client";

import { getClientSideURL } from "@/utilities/getURL";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${getClientSideURL()}/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data: {
                    errors?: { message: string }[];
                    message?: string;
                } = await res.json();

                setError(data?.errors?.[0]?.message ?? "Inloggen mislukt.");

                return;
            }

            router.push("/dashboard");
        } catch {
            setError("Er is een fout opgetreden. Probeer het opnieuw.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white/70"
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
                    className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white/70"
                >
                    Wachtwoord
                </label>

                <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
            </div>

            <div className="flex justify-end">
                <Link
                    href="/forgot-password"
                    className="text-xs text-white/60 hover:text-white/80"
                >
                    Wachtwoord vergeten?
                </Link>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-white/90 disabled:opacity-50"
            >
                {loading ? "Bezig..." : "Inloggen"}
            </button>
        </form>
    );
}
