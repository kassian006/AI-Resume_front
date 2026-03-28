type Props = {
  status: "queued" | "processing" | "completed" | "failed" | "stopped";
};

const styles: Record<Props["status"], string> = {
  queued: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  processing: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  failed: "bg-red-500/15 text-red-300 border-red-500/30",
  stopped: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
};

export function StatusBadge({ status }: Props) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles[status]}`}>
      {status}
    </span>
  );
}