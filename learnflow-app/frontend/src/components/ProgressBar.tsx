const LEVEL_COLORS: Record<string, string> = {
  Beginner:   "bg-red-500",
  Learning:   "bg-yellow-500",
  Proficient: "bg-green-500",
  Mastered:   "bg-blue-500",
};

function getLevel(pct: number): string {
  if (pct <= 40) return "Beginner";
  if (pct <= 70) return "Learning";
  if (pct <= 90) return "Proficient";
  return "Mastered";
}

interface Props {
  module: string;
  percentage: number;
}

export default function ProgressBar({ module, percentage }: Props) {
  const level = getLevel(percentage);
  const color = LEVEL_COLORS[level];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">{module}</span>
        <span className={`${color} text-white text-xs font-medium px-2 py-0.5 rounded-full`}>
          {level}
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">{percentage}% complete</span>
    </div>
  );
}
