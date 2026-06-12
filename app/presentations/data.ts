export type Presentation = {
  slug: string;
  title: string;
  description: string;
  tag: string;
  embedUrl: string | null;
};

export const presentations: Presentation[] = [
  {
    slug: "9news",
    title: "9News",
    description: "Introduction to 9fin's news product and editorial workflow.",
    tag: "Editorial",
    embedUrl:
      "https://docs.google.com/presentation/d/e/2PACX-1vSGli6oNsmXu3nHN13GJYpQhVlrFggyB4ZQUdxC83IzSxbDvnlGoDhtFfFKqQmfHcT-F53VTnBaogoO/pubembed?start=false&loop=false&delayms=3000",
  },
  {
    slug: "product-overview",
    title: "Product Overview",
    description: "A tour of 9fin's core data platform and tools.",
    tag: "Platform",
    embedUrl: null,
  },
  {
    slug: "data-and-analytics",
    title: "Data & Analytics",
    description: "How to use 9fin's data tools and market intelligence.",
    tag: "Data",
    embedUrl: null,
  },
  {
    slug: "company-culture",
    title: "Company Culture",
    description: "9fin's values, ways of working, and team structure.",
    tag: "Culture",
    embedUrl: null,
  },
  {
    slug: "workflow-and-tools",
    title: "Workflow & Tools",
    description: "The software and processes you'll use day to day.",
    tag: "Operations",
    embedUrl: null,
  },
  {
    slug: "market-primer",
    title: "Market Primer",
    description: "Key concepts in leveraged finance and credit markets.",
    tag: "Finance",
    embedUrl: null,
  },
  {
    slug: "ratings-101",
    title: "Ratings 101",
    description: "What credit ratings measure, the three agencies, reading the scale, outlooks & watch, CFR vs instrument, and why ratings matter on 9fin.",
    tag: "Ratings",
    embedUrl:
      "https://docs.google.com/presentation/d/10-8HDEW8namGnbPy1qc7UjyC6JEmCjQglhKYnsCDtYM/embed?start=false&loop=false&delayms=3000",
  },
];
