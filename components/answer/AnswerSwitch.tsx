import {
  NumericAnswerForm,
  type PriorAttempt,
} from "@/components/answer/NumericAnswerForm";
import { McqAnswerForm } from "@/components/answer/McqAnswerForm";
import { FreeformAnswerForm } from "@/components/answer/FreeformAnswerForm";
import { CodeAnswerForm } from "@/components/answer/CodeAnswerForm";
import type {
  CodeMeta,
  FreeformMeta,
  McqMeta,
} from "@/content/question-types";

interface AnswerSwitchProps {
  questionId: string;
  questionTitle: string;
  answerKind: string;
  answerMeta: unknown;
  solutionMd: string | null;
  priorAttempts: PriorAttempt[];
  alreadySolved: boolean;
}

/**
 * Routes a question to the right answer-form component by `answer_kind`.
 *
 * `answer_meta` comes off Postgres as `unknown` jsonb; this is the one
 * place we narrow it. If the meta payload is missing for an MCQ / freeform
 * / code question (e.g. partially-seeded data), we fall back to a clear
 * message rather than a runtime crash.
 */
export function AnswerSwitch({
  questionId,
  questionTitle,
  answerKind,
  answerMeta,
  solutionMd,
  priorAttempts,
  alreadySolved,
}: AnswerSwitchProps) {
  if (
    answerKind === "numeric" ||
    answerKind === "fraction" ||
    answerKind === "exact"
  ) {
    return (
      <NumericAnswerForm
        questionId={questionId}
        questionTitle={questionTitle}
        solutionMd={solutionMd}
        priorAttempts={priorAttempts}
        alreadySolved={alreadySolved}
        placeholder={placeholderFor(answerKind)}
      />
    );
  }

  if (answerKind === "mcq") {
    const meta = answerMeta as McqMeta | null;
    if (!meta || !meta.options || meta.options.length === 0) {
      return <UnconfiguredKindNotice kind={answerKind} />;
    }
    return (
      <McqAnswerForm
        questionId={questionId}
        questionTitle={questionTitle}
        answerMeta={meta}
        solutionMd={solutionMd}
        alreadySolved={alreadySolved}
      />
    );
  }

  if (answerKind === "freeform") {
    const meta = answerMeta as FreeformMeta | null;
    if (!meta || !Array.isArray(meta.rubric)) {
      return <UnconfiguredKindNotice kind={answerKind} />;
    }
    return (
      <FreeformAnswerForm
        questionId={questionId}
        questionTitle={questionTitle}
        answerMeta={meta}
        solutionMd={solutionMd}
        alreadySolved={alreadySolved}
      />
    );
  }

  if (answerKind === "code") {
    const meta = answerMeta as CodeMeta | null;
    if (!meta || !meta.test_cases || meta.test_cases.length === 0) {
      return <UnconfiguredKindNotice kind={answerKind} />;
    }
    return (
      <CodeAnswerForm
        questionId={questionId}
        questionTitle={questionTitle}
        answerMeta={meta}
        solutionMd={solutionMd}
        alreadySolved={alreadySolved}
      />
    );
  }

  return <UnconfiguredKindNotice kind={answerKind} />;
}

function placeholderFor(kind: string): string {
  if (kind === "exact") return "Your answer (a short word or phrase)";
  if (kind === "fraction") return "A fraction or decimal — e.g. 1/3 or 0.333";
  return "Your answer (e.g. 1/3, 0.5, 6)";
}

function UnconfiguredKindNotice({ kind }: { kind: string }) {
  return (
    <div className="card px-5 py-6 text-sm text-fg-muted">
      <div className="text-xs uppercase tracking-wider text-fg-subtle">
        Answer kind: {kind}
      </div>
      <p className="mt-2">
        This question is missing its <code>answer_meta</code> payload, so the
        answer form can't render. If you wrote it locally, double-check the
        seed file for the {kind} configuration.
      </p>
    </div>
  );
}
