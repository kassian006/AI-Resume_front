"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Заполни email и пароль");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register(email.trim(), password);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0b0f] px-6 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,70,150,0.22),transparent_35%),radial-gradient(circle_at_bottom,rgba(60,90,180,0.16),transparent_30%)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.06)]">
            R
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Resume AI</h1>
            <p className="text-sm text-zinc-400">Создание аккаунта</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Регистрация</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Создай аккаунт для работы с системой.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#111118] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-zinc-500 focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">
                Пароль
              </label>
              <input
                type="password"
                placeholder="Придумай пароль"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#111118] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-zinc-500 focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-500/20"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 to-rose-500 px-4 py-3.5 text-base font-semibold text-white transition hover:scale-[1.01] hover:shadow-[0_10px_30px_rgba(217,70,239,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Создание..." : "Создать аккаунт"}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-zinc-400">
            Уже есть аккаунт?{" "}
            <Link
              href="/login"
              className="font-semibold text-fuchsia-300 transition hover:text-fuchsia-200"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}