"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessions, uploadForAnalysis, uploadForMatching } from "@/lib/api";
import { ResumeSessionListItem } from "@/lib/types";
import { clearTokens, isAuthed } from "@/lib/auth";
import { ModeCard } from "@/components/mode-card";
import { UploadResumeForm } from "@/components/upload-resume-form";
import { SessionCard } from "@/components/session-card";

export default function DashboardPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"improve" | "match" | null>(null);
  const [sessions, setSessions] = useState<ResumeSessionListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthed()) {
      router.push("/login");
      return;
    }

    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      setLoading(true);
      const data = await getSessions();
      setSessions(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalysisUpload(file: File) {
    const result = await uploadForAnalysis(file);
    router.push(`/sessions/${result.session_id}`);
  }

  async function handleMatchingUpload(file: File) {
    const result = await uploadForMatching(file);
    router.push(`/sessions/${result.session_id}`);
  }

  function logout() {
    clearTokens();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black">AI Resume Assistant</h1>
            <p className="mt-2 text-zinc-400">
              Анализируй резюме и подбирай вакансии по OCR.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
          >
            Выйти
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <ModeCard
            title="Анализ резюме"
            description="OCR извлекает текст, затем AI находит ошибки и дает улучшения."
            onClick={() => setMode("improve")}
          />
          <ModeCard
            title="Подбор вакансий"
            description="OCR извлекает навыки из резюме, после чего система подбирает подходящие вакансии."
            onClick={() => setMode("match")}
          />
        </div>

        {mode === "improve" && (
          <div className="mb-8">
            <UploadResumeForm
              title="Загрузить резюме для анализа"
              buttonText="Запустить анализ"
              onSubmit={handleAnalysisUpload}
            />
          </div>
        )}

        {mode === "match" && (
          <div className="mb-8">
            <UploadResumeForm
              title="Загрузить резюме для подбора вакансий"
              buttonText="Подобрать вакансии"
              onSubmit={handleMatchingUpload}
            />
          </div>
        )}

        <section>
          <h2 className="mb-4 text-2xl font-bold">История сессий</h2>

          {loading ? (
            <p className="text-zinc-400">Загрузка...</p>
          ) : sessions.length === 0 ? (
            <p className="text-zinc-400">Сессий пока нет.</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <SessionCard key={session.session_id} session={session} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}