import { Play } from "@phosphor-icons/react";

interface VideoCardProps {
  label: string;
  className?: string;
  playSize?: number;
}

export default function VideoCard({ label, className = "", playSize = 22 }: VideoCardProps) {
  return (
    <div
      className={`cursor-hover-target group relative overflow-hidden rounded-[2rem] glass-card flex items-center justify-center text-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-(--shadow-md) ${className}`}
    >
      <div className="flex flex-col items-center gap-3 px-4">
        <div
          className="rounded-full bg-(--accent) text-(--accent-text) flex items-center justify-center transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          style={{ width: playSize * 1.9, height: playSize * 1.9 }}
        >
          <Play size={playSize * 0.75} weight="fill" />
        </div>
        <span className="text-sm font-semibold text-(--text-secondary)">{label}</span>
      </div>
    </div>
  );
}
