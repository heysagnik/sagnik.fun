// Tiny on-site answer engine for the dock's "Ask me" bar. No model, no network: it matches
// keywords against a few facts about me and falls back to pointing at email.
const FACTS: { keys: string[]; answer: string }[] = [
  {
    keys: ["hi", "hello", "hey", "sup"],
    answer: "Hey! Ask me about my work, my stack, or what I'm up to.",
  },
  {
    keys: ["who", "about", "yourself", "intro"],
    answer:
      "I'm Sagnik, a final-year CS student at VIT Bhopal. I build AI agents and the backend systems they run on.",
  },
  {
    keys: ["work", "project", "built", "build", "shipped", "ship"],
    answer:
      "ScreenREC is the one people know: a free browser screen recorder. Across my repos I have 300 GitHub stars. The rest are on the Work page.",
  },
  {
    keys: ["screenrec", "screen"],
    answer: "ScreenREC is a free screen recorder that runs entirely in your browser. My repos have 300 stars on GitHub in total.",
  },
  {
    keys: ["intern", "experience", "job", "company", "mytribe", "indianoil"],
    answer:
      "Two internships: mytribe in Bengaluru (a sales assistant that cut provider onboarding from 45 to 18 minutes) and IndianOil in Haldia (number plate recognition at three gates).",
  },
  {
    keys: ["stack", "tech", "tools", "language", "use"],
    answer: "Mostly TypeScript, Python and Postgres, with LLM tooling on top. This site is Next.js and Tailwind.",
  },
  {
    keys: ["users", "dau", "traffic"],
    answer: "My apps have about 11.5K daily active users.",
  },
  {
    keys: ["product hunt", "producthunt", "award", "won", "prize"],
    answer: "I took 2nd place at Product Hunt.",
  },
  {
    keys: ["hobby", "hobbies", "fun", "free", "bollywood", "music"],
    answer: "90's Bollywood, way too loud, hackathons, and at least one unfinished project on my desk.",
  },
  {
    keys: ["resume", "cv"],
    answer: "Grab it from the Resume button on the Work page.",
  },
  {
    keys: ["contact", "email", "reach", "hire", "talk", "twitter", "linkedin"],
    answer: "Email me at sahoosagnik1@gmail.com, or find me as @heysagnik on X.",
  },
];

const FALLBACK = "Not sure about that one. Email sahoosagnik1@gmail.com and I'll reply for real.";

export function ask(question: string): string {
  const q = ` ${question.toLowerCase().replace(/[^a-z0-9\s]/g, " ")} `;
  let best = { score: 0, answer: FALLBACK };
  for (const fact of FACTS) {
    const score = fact.keys.reduce((n, k) => n + (q.includes(` ${k}`) ? 1 : 0), 0);
    if (score > best.score) best = { score, answer: fact.answer };
  }
  return best.answer;
}
