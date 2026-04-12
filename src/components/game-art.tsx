type GameArtProps = {
  name: string;
  className?: string;
};

const gradients = [
  "from-amber-300 to-rose-400",
  "from-sky-300 to-indigo-500",
  "from-emerald-300 to-teal-500",
  "from-fuchsia-300 to-violet-500",
  "from-orange-300 to-red-500",
  "from-lime-300 to-emerald-500",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function GameArt({ name, className = "" }: GameArtProps) {
  const gradient = gradients[name.length % gradients.length];

  return (
    <div
      aria-hidden="true"
      className={`flex aspect-[4/3] items-end rounded-3xl bg-gradient-to-br ${gradient} p-4 text-white shadow-lg ${className}`}
    >
      <div>
        <div className="text-4xl font-bold tracking-[0.2em]">{initials(name)}</div>
        <div className="mt-2 text-sm font-medium/5 opacity-90">{name}</div>
      </div>
    </div>
  );
}
