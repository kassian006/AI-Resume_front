"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSessionDetail, getSessionMatches } from "@/lib/api";
import { ResumeMatchResult, ResumeSessionDetail } from "@/lib/types";
import { ResultErrorsList } from "@/components/result-errors-list";
import { ResultJobsList } from "@/components/result-jobs-list";
import { StatusBadge } from "@/components/status-badge";

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = Number(params.id);

  const [analysis, setAnalysis] = useState<ResumeSessionDetail | null>(null);
  const [matches, setMatches] = useState<ResumeMatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"analysis" | "match" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!analysis && !matches) {
          setLoading(true);
        }

        setError("");

        const detailData = await getSessionDetail(sessionId);
        if (cancelled) return;

        setAnalysis(detailData);

        if (detailData.session_type === "match") {
          setMode("match");

          const matchData = await getSessionMatches(sessionId);
          if (cancelled) return;

          setMatches(matchData);
        } else {
          setMode("analysis");
          setMatches(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Ошибка загрузки");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    const interval = setInterval(load, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [sessionId]);

  if (loading && !analysis && !matches) {
    return (
      <div className="min-h-screen bg-[#09090b] p-10 text-white">
        Загрузка...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] p-10 text-red-400">
        {error}
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#09090b] p-10 text-white">
        Ничего не найдено.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
        >
          Назад
        </button>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{analysis.filename}</h1>

              <p className="mt-1 text-zinc-400">
                Итерация: {analysis.current_iteration}
              </p>

              <p className="mt-1 text-zinc-400">
                Тип сессии:{" "}
                {analysis.session_type === "match"
                  ? "Подбор вакансий"
                  : "Анализ резюме"}
              </p>
            </div>

            <StatusBadge status={analysis.status} />
          </div>

          {mode === "match" && matches && (
            <p className="text-zinc-300">{matches.final_message}</p>
          )}

          {mode === "analysis" && (
            <>
              {analysis.result.final_message && (
                <p className="text-zinc-300">{analysis.result.final_message}</p>
              )}

              {analysis.result.status && (
                <p className="mt-2 text-sm text-zinc-400">
                  Статус обработки: {analysis.result.status}
                </p>
              )}
            </>
          )}
        </div>

        {mode === "analysis" && (
          <section className="space-y-6">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Результат анализа</h2>
              <ResultErrorsList errors={analysis.result.errors} />
            </div>

            {analysis.result.improved_resume && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h3 className="mb-3 text-xl font-bold">Исправленное резюме</h3>
                <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-300">
                  {analysis.result.improved_resume}
                </pre>
              </div>
            )}
          </section>
        )}

        {mode === "match" && (
          <section>
            <h2 className="mb-4 text-2xl font-bold">Подбор вакансий</h2>

            {!!matches?.skills_found.length && (
              <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="mb-3 text-sm font-semibold text-white">
                  Найденные навыки
                </p>

                <div className="flex flex-wrap gap-2">
                  {matches.skills_found.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ResultJobsList jobs={matches?.jobs || []} />
          </section>
        )}
      </div>
    </main>
  );
}