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

  useEffect(() => {
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  async function load() {
    try {
      setLoading(true);

      try {
        const matchData = await getSessionMatches(sessionId);
        setMatches(matchData);
        setMode("match");
        setAnalysis(null);
        return;
      } catch {}

      const analysisData = await getSessionDetail(sessionId);
      setAnalysis(analysisData);
      setMode("analysis");
      setMatches(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !analysis && !matches) {
    return <div className="min-h-screen bg-[#09090b] p-10 text-white">Загрузка...</div>;
  }

  const data = matches || analysis;
  if (!data) {
    return <div className="min-h-screen bg-[#09090b] p-10 text-white">Ничего не найдено.</div>;
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
              <h1 className="text-2xl font-bold">{data.filename}</h1>
              <p className="mt-1 text-zinc-400">Итерация: {data.current_iteration}</p>
            </div>
            <StatusBadge status={data.status} />
          </div>

          {mode === "match" && matches && (
            <p className="text-zinc-300">{matches.final_message}</p>
          )}

          {mode === "analysis" && analysis && (
            <p className="text-zinc-300">{analysis.result.final_message}</p>
          )}
        </div>

        {mode === "analysis" && analysis && (
          <section>
            <h2 className="mb-4 text-2xl font-bold">Результат анализа</h2>
            <ResultErrorsList errors={analysis.result.errors} />
          </section>
        )}

        {mode === "match" && matches && (
          <section>
            <h2 className="mb-4 text-2xl font-bold">Подбор вакансий</h2>

            {!!matches.skills_found.length && (
              <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="mb-3 text-sm font-semibold text-white">Найденные навыки</p>
                <div className="flex flex-wrap gap-2">
                  {matches.skills_found.map((skill) => (
                    <span key={skill} className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ResultJobsList jobs={matches.jobs} />
          </section>
        )}
      </div>
    </main>
  );
}