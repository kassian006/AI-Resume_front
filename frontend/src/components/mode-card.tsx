type Props = {
  title: string;
  description: string;
  onClick: () => void;
};

export function ModeCard({ title, description, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 text-left transition hover:bg-white/10 hover:-translate-y-1"
    >
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-sm leading-6 text-zinc-300">{description}</p>
    </button>
  );
}