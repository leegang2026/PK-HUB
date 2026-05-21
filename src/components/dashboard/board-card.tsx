import Link from "next/link";
import { MoreHorizontal, ArrowUpRight } from "lucide-react";

interface BoardCardProps {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
  updatedAt: string;
}

export function BoardCard({ id, name, icon, description, count, updatedAt }: BoardCardProps) {
  return (
    <Link
      href={`/boards/${id}`}
      className="group relative flex flex-col rounded-lg border border-neutral-200 bg-white p-4 transition-all hover:shadow-sm hover:border-neutral-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-semibold text-neutral-900">{name}</h3>
        </div>
        <button className="rounded p-1 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-neutral-100">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1 text-sm text-neutral-500 line-clamp-1">{description}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
        <span>{count} 条更新</span>
        <span>{updatedAt}</span>
      </div>
    </Link>
  );
}
