import { Suspense } from "react";
import TeamHub from "@/app/components/TeamHub";

const steps = [
  {
    id: "guides" as const,
    title: "Best Practice Guides",
    description: "Read the Notion reference docs covering ratings coverage and methodology.",
    href: "/notion-guides?team=ratings",
    available: true,
  },
  {
    id: "presentations" as const,
    title: "Presentations",
    description: "Work through the training decks on ratings workflow and processes.",
    href: "/presentations?team=ratings",
    available: true,
  },
  {
    id: "knowledge" as const,
    title: "Test Your Knowledge",
    description: "8-question quiz on ratings methodology — the scale, agencies, outlooks, CFR vs instrument, and why ratings matter on 9fin.",
    href: "/ratings/knowledge",
    available: true,
  },
  {
    id: "training" as const,
    title: "Triage Assessment",
    description: "10-question quiz on real #ratings-news-events Slack messages — decide when to update CFR, instrument ratings, publish, or ignore.",
    href: "/ratings/quiz",
    available: true,
  },
];

export default function RatingsPage() {
  return (
    <Suspense>
      <TeamHub
        team="ratings"
        label="Ratings"
        description="Credit ratings coverage, methodology, and processes."
        steps={steps}
      />
    </Suspense>
  );
}
