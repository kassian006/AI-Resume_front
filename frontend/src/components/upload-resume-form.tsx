"use client";

import { useState } from "react";

type Props = {
  title: string;
  buttonText: string;
  onSubmit: (file: File) => Promise<void>;
};

export function UploadResumeForm({ title, buttonText, onSubmit }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Выберите PDF файл");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSubmit(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="mb-4 text-xl font-bold text-white">{title}</h3>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-200"
      />

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
      >
        {loading ? "Загрузка..." : buttonText}
      </button>
    </form>
  );
}