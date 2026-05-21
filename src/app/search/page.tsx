import { AppShell } from "@/components/layout/app-shell";
import { SearchResults } from "@/components/search/search-results";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 py-8 md:px-12">
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          搜索
        </h1>
        <p className="mt-1 text-sm text-neutral-500 mb-6">
          搜索历史文章、标签和来源
        </p>
        <SearchResults initialQuery={q || ""} />
      </div>
    </AppShell>
  );
}
