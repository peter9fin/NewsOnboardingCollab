import { Suspense } from "react";
import TeamHub from "@/app/components/TeamHub";

const steps = [
  {
    id: "guides" as const,
    title: "Best Practice Guides",
    description: "Read the Notion reference docs covering the News App.",
    href: "/notion-guides?team=newsapp",
    available: true,
  },
  {
    id: "presentations" as const,
    title: "Presentations",
    description: "Work through the training decks on News App workflows and processes.",
    href: "/presentations?team=newsapp",
    available: true,
  },
  {
    id: "training" as const,
    title: "Test Your Knowledge",
    description: "Coming soon.",
    href: "#",
    available: false,
  },
];

export default function NewsAppPage() {
  return (
    <Suspense>
      <TeamHub
        team="newsapp"
        label="NewsApp"
        description="News application — development, QA, and maintenance."
        steps={steps}
      />
    </Suspense>
  );
}
