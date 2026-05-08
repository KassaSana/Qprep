import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="card p-6">
        <div className="text-xs uppercase tracking-wider text-fg-muted">404</div>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">
          Not found.
        </h1>
        <p className="mt-3 text-sm text-fg-muted">
          That page doesn&apos;t exist (anymore). It may have been a question slug
          that hasn&apos;t been seeded yet — try the question bank.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/questions">
            <Button size="sm">Browse questions</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="sm">
              Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
