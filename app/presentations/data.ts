export type Presentation = {
  slug: string;
  title: string;
  description: string;
  tag: string;
  team: string | null; // null = unassigned (only shown on /presentations with no filter)
  embedUrl: string | null;
};

export const presentations: Presentation[] = [
  {
    slug: "9news",
    title: "9News",
    description: "Introduction to 9fin's news product and editorial workflow.",
    tag: "Editorial",
    team: "9news",
    embedUrl:
      "https://docs.google.com/presentation/d/e/2PACX-1vSGli6oNsmXu3nHN13GJYpQhVlrFggyB4ZQUdxC83IzSxbDvnlGoDhtFfFKqQmfHcT-F53VTnBaogoO/pubembed?start=false&loop=false&delayms=3000",
  },
  {
    slug: "newsapp",
    title: "News App Training",
    description: "How to use the NewsApp changes queue — access, triage order, reviewing page changes, exchange items, earnings periods, and edge cases.",
    tag: "Editorial",
    team: "9news",
    embedUrl:
      "https://docs.google.com/presentation/d/1frAnEZuRhIBD8XdEG1q0kxbwUvjcBDD9OWSBLEDvChA/embed?start=false&loop=false&delayms=3000",
  },
  {
    slug: "ratings-101",
    title: "Ratings 101",
    description: "What credit ratings measure, the three agencies, reading the scale, outlooks & watch, CFR vs instrument, and why ratings matter on 9fin.",
    tag: "Ratings",
    team: "ratings",
    embedUrl:
      "https://docs.google.com/presentation/d/10-8HDEW8namGnbPy1qc7UjyC6JEmCjQglhKYnsCDtYM/embed?start=false&loop=false&delayms=3000",
  },
];
