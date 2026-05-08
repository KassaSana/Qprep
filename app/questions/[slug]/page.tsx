import Link from "next/link";
import { notFound } from "next/navigation";
import { Latex } from "@/components/Latex";
import { AnswerSwitch } from "@/components/answer/AnswerSwitch";
import type { PriorAttempt } from "@/components/answer/NumericAnswerForm";
import { getAnonId } from "@/lib/anon";
import { getLocalAttemptsForQuestion } from "@/lib/local-dev";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import {
  loadAllQuestions,
  loadQuestionBySlug,
} from "@/lib/questions-data";
import { computeNext, parseFromParam } from "@/lib/next-question";
import { difficultyLabel } from "@/content/question-types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}

export default async function QuestionDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { from: fromRaw } = await searchParams;
  const from = parseFromParam(fromRaw);
  const anonId = await getAnonId();
  const supabaseReady = isSupabaseConfigured();

  const question = await loadQuestionBySlug(slug);
  if (!question) {
    notFound();
  }

  let priorAttempts: PriorAttempt[] = [];
  if (anonId) {
    if (!supabaseReady) {
      priorAttempts = getLocalAttemptsForQuestion(anonId, question.id)
        .slice(0, 8)
        .map((r) => ({
          submitted: r.submitted_answer,
          isCorrect: r.is_correct,
          createdAt: r.created_at,
        }));
    } else {
      const sb = getSupabaseAdmin();
      const { data: rows } = await sb
        .from("attempts")
        .select("submitted_answer, is_correct, created_at")
        .eq("anon_user_id", anonId)
        .eq("question_id", question.id)
        .order("created_at", { ascending: false })
        .limit(8);
      priorAttempts = (rows ?? []).map((r) => ({
        submitted: r.submitted_answer as string,
        isCorrect: r.is_correct as boolean,
        createdAt: r.created_at as string,
      }));
    }
  }
  const alreadySolved = priorAttempts.some((a) => a.isCorrect);

  // Pre-compute the auto-advance target so the answer forms can render a
  // "Next →" CTA the moment a submission is graded correct. We always pass
  // the playlist context through on the next link, so a full sweep through
  // a playlist threads its slug from question to question without needing
  // the user to revisit the playlist page.
  const { questions: allQuestions, attempts: allAttempts } =
    await loadAllQuestions(anonId);
  const solvedQuestionIds = new Set(
    allAttempts.filter((a) => a.is_correct).map((a) => a.question_id)
  );
  const next = computeNext({
    from,
    currentQuestionId: question.id,
    questions: allQuestions,
    solvedQuestionIds,
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/questions"
        className="inline-block text-sm text-fg-muted hover:text-fg"
      >
        ← All questions
      </Link>

      <header className="mt-4 mb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="pill">{question.topic}</span>
          <span className="pill">{difficultyLabel(question.difficulty)}</span>
          <span className="pill">{question.answer_kind}</span>
          {question.companies.map((c) => (
            <span
              key={c}
              className="rounded-md border border-border bg-bg-subtle px-2 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted"
            >
              {c}
            </span>
          ))}
          {question.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-fg-subtle">
              #{t}
            </span>
          ))}
          {question.source && (
            <span className="ml-auto text-fg-subtle">
              source: {question.source}
            </span>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {question.title}
        </h1>
      </header>

      <article className="card p-5 mb-8">
        <Latex className="text-base text-fg">{question.prompt_md}</Latex>
      </article>

      <AnswerSwitch
        questionId={question.id}
        questionTitle={question.title}
        answerKind={question.answer_kind}
        answerMeta={question.answer_meta}
        solutionMd={question.solution_md}
        priorAttempts={priorAttempts}
        alreadySolved={alreadySolved}
        nextHref={next?.href ?? null}
        nextLabel={next?.label ?? null}
      />
    </main>
  );
}
