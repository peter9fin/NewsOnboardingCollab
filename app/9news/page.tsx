import { Suspense } from "react";
import TeamHub from "@/app/components/TeamHub";

const steps = [
  {
    id: "guides" as const,
    title: "Best Practice Guides",
    description: "Read the Notion reference docs covering 9news workflows, standards, and processes.",
    href: "/notion-guides?team=9news",
    available: true,
  },
  {
    id: "presentations" as const,
    title: "Presentations",
    description: "Work through the structured training decks covering 9news editorial workflows.",
    href: "/presentations/9news",
    available: true,
  },
  {
    id: "training" as const,
    title: "Test Your Knowledge",
    description: "Assess your triage skills with real headlines from the 9news feed.",
    href: "/9news/training?team=9news",
    available: true,
  },
];

export default function NineNewsPage() {
  return (
    <Suspense>
      <TeamHub
        team="9news"
        label="9news"
        description="Editorial news workflow — triage, tagging, and production."
        steps={steps}
      />
    </Suspense>
  );
}
