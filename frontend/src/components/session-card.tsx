import Link from "next/link";
import { ResumeSessionListItem } from "@/lib/types";
import { StatusBadge } from "./status-badge";

export function SessionCard({ session }: { session: ResumeSessionListItem }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-base font-semibold text-white">{session.filename}</p>
        <p className="mt-1 text-sm text-zinc-400">
          Итерация: {session.current_iteration}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <StatusBadge status={session.status} />
        <Link
          href={`/sessions/${session.session_id}`}
          className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          Открыть
        </Link>
      </div>
    </div>
  );
}