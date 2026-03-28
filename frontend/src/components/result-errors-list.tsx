import { ResumeErrorItem } from "@/lib/types";

export function ResultErrorsList({ errors }: { errors: ResumeErrorItem[] }) {
  if (!errors.length) {
    return <p className="text-zinc-400">Ошибок не найдено.</p>;
  }

  return (
    <div className="space-y-4">
      {errors.map((item, index) => (
        <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="mb-2 text-sm text-red-300">Original: {item.original}</p>
          <p className="mb-2 text-sm text-emerald-300">Improved: {item.improved}</p>
          <p className="text-sm text-zinc-300">Advice: {item.advice}</p>
        </div>
      ))}
    </div>
  );
}