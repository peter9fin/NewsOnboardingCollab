import { createClient } from "@/lib/supabase/client";

export type Team = "9news" | "newsapp" | "ratings";
export type Step = "guides" | "presentations" | "newsapp" | "knowledge" | "training";

// ─── Step progress ────────────────────────────────────────────────────────────

export async function getTeamProgress(
  team: Team
): Promise<Record<Step, boolean>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { guides: false, presentations: false, newsapp: false, knowledge: false, training: false };

  const { data } = await supabase
    .from("user_progress")
    .select("step")
    .eq("user_id", user.id)
    .eq("team", team);

  const completed = new Set((data ?? []).map((r: { step: string }) => r.step));
  return {
    guides: completed.has("guides"),
    presentations: completed.has("presentations"),
    newsapp: completed.has("newsapp"),
    knowledge: completed.has("knowledge"),
    training: completed.has("training"),
  };
}

export async function markStepComplete(
  team: Team,
  step: Step
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("user_progress")
    .upsert(
      { user_id: user.id, team, step },
      { onConflict: "user_id,team,step" }
    );
}

// ─── Training results ─────────────────────────────────────────────────────────

export interface TrainingAnswerInput {
  articleTitle: string;
  source: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export async function saveTrainingAttempt(
  team: Team,
  score: number,
  total: number,
  answers: TrainingAnswerInput[]
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: attempt } = await supabase
    .from("training_attempts")
    .insert({ user_id: user.id, team, score, total })
    .select("id")
    .single();

  if (!attempt) return;

  await supabase.from("training_answers").insert(
    answers.map((a) => ({
      attempt_id: attempt.id,
      user_id: user.id,
      article_title: a.articleTitle,
      source: a.source,
      user_answer: a.userAnswer,
      correct_answer: a.correctAnswer,
      is_correct: a.isCorrect,
    }))
  );
}
