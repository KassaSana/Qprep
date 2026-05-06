import Link from "next/link";
import { notFound } from "next/navigation";
import { Latex } from "@/components/Latex";
import { AnswerForm, type PriorAttempt } from "@/components/AnswerForm";
import { getAnonId } from "@/lib/anon";
import {
  getLocalAttemptsForQuestion,
  getLocalQuestionBySlug,
} from "@/lib/local-dev";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const DIFFICULTY_LABEL = ["", "Easy", "Easy+", "Medium", "Hard", "Brutal"];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function QuestionPage({ params }: PageProps) {
  const { slug } = await params;
  const anonId = await getAnonId();
  const supabaseReady = isSupabaseConfigured();

  let question:
    | {
        id: string;
        slug: string;
        title: string;
        prompt_md: string;
        solution_md: string | null;
        difficulty: number;
        tags: string[];
        source: string | null;
      }
    | null = null;

  let priorAttempts: PriorAttempt[] = [];
  let alreadySolved = false;

  if (!supabaseReady) {
    const localQuestion = getLocalQuestionBySlug(slug);
    if (!localQuestion) {
      notFound();
    }
    question = {
      id: localQuestion.id,
      slug: localQuestion.slug,
      title: localQuestion.title,
      prompt_md: localQuestion.prompt_md,
      solution_md: localQuestion.solution_md,
      difficulty: localQuestion.difficulty,
      tags: localQuestion.tags,
      source: localQuestion.source,
    };

    priorAttempts = getLocalAttemptsForQuestion(anonId, localQuestion.id)
      .slice(0, 8)
      .map((r) => ({
        submitted: r.submitted_answer,
        isCorrect: r.is_correct,
        createdAt: r.created_at,
      }));
    alreadySolved = priorAttempts.some((a) => a.isCorrect);
  } else {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("questions")
      .select(
        "id, slug, title, prompt_md, solution_md, difficulty, tags, source"
      )
      .eq("slug", slug)
      .eq("track", "researcher")
      .single();

    if (error || !data) {
      notFound();
    }
    question = {
      id: data.id as string,
      slug: data.slug as string,
      title: data.title as string,
      prompt_md: data.prompt_md as string,
      solution_md: (data.solution_md as string | null) ?? null,
      difficulty: data.difficulty as number,
      tags: (data.tags as string[]) ?? [],
      source: (data.source as string | null) ?? null,
    };

    if (anonId) {
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
      alreadySolved = priorAttempts.some((a) => a.isCorrect);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/researcher"
        className="inline-block text-sm text-fg-muted hover:text-fg"
      >
        ← All researcher problems
      </Link>

      <header className="mt-4 mb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="pill">
            {DIFFICULTY_LABEL[question.difficulty] ?? `D${question.difficulty}`}
          </span>
          {(question.tags ?? []).map((t: string) => (
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

      <AnswerForm
        questionId={question.id as string}
        questionTitle={question.title as string}
        solutionMd={(question.solution_md as string | null) ?? null}
        priorAttempts={priorAttempts}
        alreadySolved={alreadySolved}
      />
    </main>
  );
}
