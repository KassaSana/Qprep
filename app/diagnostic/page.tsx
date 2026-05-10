import Link from "next/link";
import { DIAGNOSTIC_SLUGS } from "@/content/diagnostic";
import { loadAllQuestions, type LoadedQuestion } from "@/lib/questions-data";
import { getAnonId } from "@/lib/anon";
import { DiagnosticRunner } from "@/app/diagnostic/DiagnosticRunner";

export const dynamic = "force-dynamic";

/**
 * 60-second diagnostic entry.
 *
 * Server-loads the curated MCQ pack, hands them to the client runner. We do
 * the load server-side (instead of fetching from /api/questions) so the
 * first paint is the actual first question — no skeleton flash.
 */
export default async function DiagnosticPage() {
  const anonId = await getAnonId();
  const { questions: bank } = await loadAllQuestions(anonId);
  const bySlug = new Map(bank.map((q) => [q.slug, q]));

  // Resolve in the order the diagnostic specifies. Drop any that can't be
  // resolved or aren't MCQ — defensive against a slug rename in the seed.
  const resolved: LoadedQuestion[] = [];
  const missing: string[] = [];
  for (const slug of DIAGNOSTIC_SLUGS) {
    const q = bySlug.get(slug);
    if (q && q.answer_kind === "mcq") {
      resolved.push(q);
    } else {
      missing.push(slug);
    }
  }

  if (resolved.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          Diagnostic unavailable
        </h1>
        <p className="mt-3 text-sm text-fg-muted">
          None of the diagnostic question slugs resolved against the live
          bank. The seed may be out of sync.
        </p>
        <ul className="mt-4 list-inside list-disc text-xs text-fg-subtle">
          {missing.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-accent underline-offset-4 hover:underline"
        >
          ← Back home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <header className="mb-6">
        <div className="text-xs font-medium uppercase tracking-wider text-fg-muted">
          60-second diagnostic
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Where should you start?
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          {resolved.length} quick MCQs across probability, stats, math, data
          structures, C++, and concurrency. Pick whichever option you think is
          right and we&apos;ll route you to the playlist that matches your
          lane. Nothing is logged as a real attempt.
        </p>
      </header>

      <DiagnosticRunner questions={serializeForClient(resolved)} />
    </main>
  );
}

/**
 * The runner is a client component, so we have to hand it serializable
 * primitives — strip everything it doesn't render.
 */
function serializeForClient(questions: LoadedQuestion[]) {
  return questions.map((q) => {
    const meta = q.answer_meta as { options?: { id: string; label: string }[] } | null;
    return {
      slug: q.slug,
      title: q.title,
      topic: q.topic,
      difficulty: q.difficulty,
      promptMd: q.prompt_md,
      answerValue: q.answer_value ?? "",
      options: (meta?.options ?? []).map((o) => ({
        id: o.id,
        label: o.label,
      })),
    };
  });
}
