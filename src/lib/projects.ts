export type CaseStudySection = {
  heading: string;
  paragraphs: string[];
  images?: string[];
};


export type Project = {
  id: string;
  title: string;
  meta: string;
  image: string;
  gallery?: string[];
  fullBleedImage?: boolean;
  href: string;
  date?: string;
  summary?: string;
  role?: string;
  stack?: string;
  credits?: string;
  sections?: CaseStudySection[];
};

export type Row = { full: Project } | { pair: [Project, Project] };

const PLACEHOLDER_SECTIONS: CaseStudySection[] = [
  {
    heading: "The problem",
    paragraphs: [
      "A short paragraph on what wasn't working before this project, and why it mattered enough to fix.",
      "A second paragraph digging into the specific constraint that shaped the approach.",
    ],
  },
  {
    heading: "The approach",
    paragraphs: [
      "What was actually built, and the key decision that made it work — the one trade-off worth explaining.",
    ],
  },
  {
    heading: "The outcome",
    paragraphs: [
      "What shipped, what it measurably changed, and what's next.",
    ],
  },
];

export const ROWS: Row[] = [
  {
    full: {
      id: "diy-analytics",
      title: "The analytics stack you can actually own",
      meta: "Web App",
      image: "/screenshots/diy-analytics.jpg",
      gallery: ["/screenshots/diy-analytics.jpg", "/diy-analytics.png"],
      href: "https://analytics.sagnik.fun",
      date: "2025",
      summary:
        "A self-hosted web analytics tool with funnels, error tracking, and an AI assistant built in — shipped as a single 2KB tracking script.",
      role: "Design and build. Solo open-source project.",
      stack: "Next.js, TypeScript, Tailwind CSS, ClickHouse, Node.js.",
      credits: "Sagnik Sahoo",
      sections: [
        {
          heading: "The problem",
          paragraphs: [
            "Most analytics tools force a trade-off: hosted platforms are easy to set up but hand your visitor data to a third party, while self-hosted alternatives are usually heavy, slow to deploy, and still ask you to ship a bloated tracking script.",
            "I wanted something I could point at my own sites without either compromise — full ownership of the data, with a tracking footprint small enough not to think about.",
          ],
        },
        {
          heading: "The approach",
          paragraphs: [
            "The core is a 2KB script that captures page views, sessions, and errors with almost no overhead, feeding a dashboard built around the questions I actually ask: traffic over time, funnels, retention cohorts, and visitor-level journeys, not just a wall of charts.",
            "An AI assistant sits on top of the raw data so I can ask questions in plain language — \"why did bounce rate spike last week\" — instead of hand-building a query for every new question.",
          ],
        },
        {
          heading: "The outcome",
          paragraphs: [
            "It now runs as the analytics layer for my own projects, including this site. Self-hosted, one lightweight script, and a dashboard that answers the questions I care about instead of the ones a generic tool assumes I have.",
          ],
        },
      ],
    },
  },
  {
    pair: [
      {
        id: "phisguard",
        title: "Real-time phishing protection, on device",
        meta: "Mobile App",
        image: "/projects/phisguard1.jpg",
        gallery: [
          "/projects/phisguard1.jpg",
          "/projects/phisguard2.jpg",
          "/projects/phisguard3.jpg",
        ],
        href: "https://read.cv/heysagnik",
        date: "2025",
        summary: "On-device phishing detection that doesn't phone home.",
        role: "Mobile App Architecture and AI Pipeline.",
        stack: "Flutter, Dart, CoreML, TensorFlow Lite.",
        sections: PLACEHOLDER_SECTIONS,
      },
      {
        id: "chikki",
        title: "A writing assistant that keeps your voice",
        meta: "Chrome Extension",
        image: "/chikki2.png",
        gallery: ["/chikki2.png", "/cloud.webp"],
        href: "https://github.com/heysagnik/chikki",
        date: "2025",
        summary: "A Chrome extension that edits toward your voice, not away from it.",
        role: "Product Design and Extension Development.",
        stack: "React, WebExtensions API, TypeScript.",
        sections: PLACEHOLDER_SECTIONS,
      },
    ],
  },
  {
    full: {
      id: "docq",
      title: "Doctor booking with AI recommendations",
      meta: "Healthcare App",
      image: "/projects/docq1.jpg",
      gallery: [
        "/projects/docq1.jpg",
        "/projects/docq3.jpg",
        "/projects/docq4.jpg",
        "/projects/docq5.jpg",
      ],
      href: "https://read.cv/heysagnik",
      date: "2024",
      summary: "Booking flow with AI-assisted doctor recommendations.",
      role: "Lead UI/UX Designer and Frontend Engineer.",
      stack: "React Native, Node.js, PostgreSQL.",
      sections: PLACEHOLDER_SECTIONS,
    },
  },
  {
    pair: [
      {
        id: "screenrec",
        title: "Screen recording, straight from the browser",
        meta: "Web Tool",
        image: "/projects/screenrec.png",
        gallery: ["/projects/screenrec.png"],
        href: "https://read.cv/heysagnik",
        date: "2024",
        summary: "Browser-native screen recording, no install required.",
        role: "Web Audio/Video Pipeline & UI.",
        stack: "Vanilla JavaScript, WebRTC, MediaStream API.",
        sections: PLACEHOLDER_SECTIONS,
      },
      {
        id: "linkees",
        title: "Bio-link pages that don't look templated",
        meta: "Web App",
        image: "/projects/linkees.png",
        gallery: ["/projects/linkees.png"],
        href: "https://read.cv/heysagnik",
        date: "2024",
        summary: "Bio-link pages designed to not look like everyone else's.",
        role: "Full-Stack Development.",
        stack: "Next.js, Tailwind CSS, Supabase.",
        sections: PLACEHOLDER_SECTIONS,
      },
    ],
  },
];

export function getAllProjects(): Project[] {
  return ROWS.flatMap((row) => ("full" in row ? [row.full] : row.pair));
}

export function getProjectById(id: string): Project | undefined {
  return getAllProjects().find((project) => project.id === id);
}
