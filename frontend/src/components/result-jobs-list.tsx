import { JobItem } from "@/lib/types";

export function ResultJobsList({ jobs }: { jobs: JobItem[] }) {
  if (!jobs.length) {
    return <p className="text-zinc-400">Подходящие вакансии не найдены.</p>;
  }

  return (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">{job.job_title}</h3>
              <p className="text-sm text-zinc-400">{job.company}</p>
            </div>
            <div className="rounded-2xl bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
              Score: {job.match_score}
            </div>
          </div>

          <div className="grid gap-2 text-sm text-zinc-300">
            <p>Локация: {job.location || "Не указана"}</p>
            <p>Зарплата: {job.salary || "Не указана"}</p>
            <p>Источник: {job.source}</p>
            {job.candidate_profile && <p>Профиль: {job.candidate_profile}</p>}
          </div>

          {!!job.why_match?.length && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-white">Почему подходит</p>
              <div className="flex flex-wrap gap-2">
                {job.why_match.map((skill) => (
                  <span key={skill} className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!!job.missing_skills?.length && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-white">Не хватает</p>
              <div className="flex flex-wrap gap-2">
                {job.missing_skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-2xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Открыть вакансию
          </a>
        </div>
      ))}
    </div>
  );
}