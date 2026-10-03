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

export const ROWS: Row[] = [
  {
    full: {
      id: "diy-analytics",
      title: "diy-analytics",
      meta: "Web App",
      image: "/projects/diy-analytics/cover.jpg",
      gallery: [
        "/projects/diy-analytics/cover.jpg",
        "/projects/diy-analytics/01-overview.jpg",
        "/projects/diy-analytics/02-getting-started.jpg",
        "/projects/diy-analytics/03-add-site.jpg",
        "/projects/diy-analytics/04-breakdowns.jpg",
        "/projects/diy-analytics/05-explore.jpg",
        "/projects/diy-analytics/06-funnels.jpg",
        "/projects/diy-analytics/07-retention.jpg",
        "/projects/diy-analytics/08-journeys.jpg",
        "/projects/diy-analytics/09-visitors.jpg",
        "/projects/diy-analytics/10-errors.jpg",
        "/projects/diy-analytics/11-ai-assistant.jpg",
        "/projects/diy-analytics/12-api-keys.jpg",
        "/projects/diy-analytics/13-connected-apps.jpg",
        "/projects/diy-analytics/14-settings-general.jpg",
        "/projects/diy-analytics/15-settings-alerts.jpg",
        "/projects/diy-analytics/16-workspace.jpg",
      ],
      href: "https://analytics.sagnik.fun",
      date: "2025",
      summary:
        "Self-hosted web analytics on a single Postgres database. No cookies, no third party, and a dashboard that answers the questions I actually ask.",
      role: "Product design, architecture, and full-stack build. Solo, open source (MIT).",
      stack:
        "Next.js, TypeScript, PostgreSQL, Drizzle ORM, Vercel Queues, Tailwind CSS, MCP.",
      credits: "Sagnik Sahoo",
      sections: [
        {
          heading: "Why I built it",
          paragraphs: [
            "Hosted analytics is easy, but your visitors' data ends up with someone else. Self-hosted tools fix that, then ask for a heavy stack and a heavy script. I wanted a third option: one Postgres database, no cookies, and a tracker that can't break the page it measures.",
          ],
        },
        {
          heading: "How it works",
          paragraphs: [
            "The tracker posts to a small /api/track endpoint. It validates the event, checks the domain, rate-limits, and hands the event to a Vercel Queue. A consumer does the write, so a traffic spike or a slow database never holds up a visitor, and a failed write is retried, not lost. A nightly job rolls up the day and prunes old data. Source maps are fetched when you open an error and never stored.",
          ],
        },
        {
          heading: "The slow dashboard",
          paragraphs: [
            "The first Overview was correct and painfully slow: 16.5 seconds on a seeded 200K-pageview project. Profiling found three culprits. A chart routine converted timezones for every pageview, each breakdown rescanned the same window, and bounce rate was computed in JavaScript. I fixed each one and split the page into three parallel requests. The same dataset now loads in 1.95 seconds, and typical projects paint in under 400ms.",
          ],
        },
        {
          heading: "What else is in it",
          paragraphs: [
            "Funnels, retention, journeys, an Explore query builder, and error tracking with breadcrumbs. There is also a read-only MCP server, plus an optional AI chat that uses the same tools, so an assistant can query your data but never change it.",
          ],
        },
        {
          heading: "Trade-offs",
          paragraphs: [
            "Vercel Queues tie ingestion to Vercel. The rate limiter is per instance. The tracker has outgrown its original 2KB goal, which now applies to the core pageview path only. Version 0.1.6 is still alpha.",
          ],
        },
      ],
    },
  },
  {
    full: {
      id: "byte",
      title: "Byte",
      meta: "Autonomous AI Agent",
      image: "/projects/byte/cover.png",
      gallery: ["/projects/byte/cover.png"],
      href: "https://github.com/heysagnik/byte",
      date: "2026",
      summary:
        "A personal AI agent that does the whole errand: it researches in parallel, makes the phone call for you, and asks before it commits you to anything.",
      role: "Product, agent architecture, and full-stack build. Solo.",
      stack:
        "React 19, Vite, Tailwind CSS, Zustand, Node.js, Express, TypeScript, Gemini, ElevenLabs, Twilio, MCP, MongoDB.",
      credits: "Sagnik Sahoo",
      sections: [
        {
          heading: "The gap",
          paragraphs: [
            "Most assistants stop at advice. They name three restaurants and leave you to find the number, make the call, and sit through the hold music. That last step, talking to a stranger on the phone, is the part many people put off. Byte takes it on.",
          ],
        },
        {
          heading: "How it's built",
          paragraphs: [
            "One orchestrator plans the task and launches focused sub-agents in parallel, each with a narrow tool set and a self-contained brief. Tools live behind a registry, and calling is an MCP server, so a new ability is one server and one line in a manifest. Every loop has a hard cap, and a per-thread abort controller means Cancel really stops the work. Each step streams to the UI over Server-Sent Events.",
          ],
        },
        {
          heading: "Making calls safe",
          paragraphs: [
            "Calls run on ElevenLabs and Twilio. The call tool starts the call, polls until it ends, and always returns something, even a partial transcript on timeout. Around it sit rules enforced in code, not left to the prompt: one call at a time, never the same number twice, and an approval gate that suspends the run until you pick an option. Anything irreversible waits for you.",
          ],
        },
        {
          heading: "What I'd fix",
          paragraphs: [
            "Search is a separate model call, because Gemini can't mix search grounding with custom tools. Approvals, cancel controllers, and live streams sit in process memory, so scaling out needs a shared store. And there are no automated tests yet, a real gap for a loop that acts in the world.",
          ],
        },
      ],
    },
  },
  {
    full: {
      id: "lumen",
      title: "Lumen",
      meta: "Document Intelligence API",
      image: "/projects/lumen/cover.jpg",
      gallery: ["/projects/lumen/cover.jpg", "/projects/lumen/01-docs.jpg"],
      href: "https://lumen.sagnik.fun/getting-started",
      date: "2026",
      summary:
        "Upload PDFs, get checkable facts. Every claim links to its exact quote and page, and Lumen flags where your documents agree or contradict.",
      role: "Product, architecture, and full-stack build. Solo.",
      stack:
        "TypeScript, Express, Next.js, PostgreSQL with pgvector, Drizzle ORM, Cloudflare AI Gateway, pdfjs, Tesseract.",
      credits: "Sagnik Sahoo",
      sections: [
        {
          heading: "The problem",
          paragraphs: [
            "Comparing two filings by eye is slow. A model summary is fast but unverifiable, and for due diligence an answer you can't trace is worth nothing. I wanted every claim to be checkable in seconds.",
          ],
        },
        {
          heading: "The pipeline",
          paragraphs: [
            "Pages go through pdfjs, with Tesseract OCR for scans and a vision model when OCR is shaky. A model extracts facts as structured records: entity, attribute, value, unit, qualifiers. Each new fact is embedded and compared with its nearest neighbors in pgvector. Cheap deterministic checks go first, such as exact matches and unit-normalised numbers. Only ambiguous pairs reach an LLM, which labels them corroborates, contradicts, or reconciled.",
          ],
        },
        {
          heading: "Why you can trust it",
          paragraphs: [
            "A fact must carry a quote, and that quote has to be found in the page text, with a small fuzzy margin for OCR noise. If it isn't, the fact is dropped, so an invented number can't enter the database. 'Reconciled' exists because many apparent contradictions are restatements or different reporting periods, and flagging them all would make the tool cry wolf.",
          ],
        },
        {
          heading: "What's missing",
          paragraphs: [
            "No auth yet, and no automated tests on the pipeline. Neighbor search can miss a contradiction that sits outside the similarity radius. In a three-model benchmark, Llama 3.3 70B matched GLM on relationship accuracy and ran much faster, so it handles text while GLM covers the vision fallback.",
          ],
        },
      ],
    },
  },
  {
    pair: [
      {
        id: "phisguard",
        title: "PhisGuard",
        meta: "Mobile App",
        image: "/projects/phisguard/cover.png",
        gallery: [
          "/projects/phisguard/01-mockup-1.png",
          "/projects/phisguard/02-mockup-2.png",
          "/projects/phisguard/03-mockup-3.png",
        ],
        href: "https://github.com/heysagnik/phish-guard",
        date: "2025",
        summary:
          "An Android link checker that sits in front of your browser. Tap a link, get a risk score in seconds, and open it only if you still want to.",
        role: "Mobile app architecture, scoring backend, and design. Solo.",
        stack:
          "Flutter, Dart, Node.js, Express, Vercel, Google Safe Browsing, Gemini 2.0 Flash.",
        sections: [
          {
            heading: "The problem",
            paragraphs: [
              "Phishing arrives as a link, and the decision to tap takes about a second. Browsers warn only after the page starts loading, and only for URLs already on a blocklist, which fresh phishing domains never are. I wanted the check to happen before the browser opens.",
            ],
          },
          {
            heading: "The app",
            paragraphs: [
              "PhisGuard registers for http, https, and its own scheme, so Android can send any tapped link to it. A scan screen shows a risk score, a threat level, and the reasons. Safe links open in Chrome. Unsafe ones get a red 'Proceed anyway', because a warning should inform the decision, not make it.",
            ],
          },
          {
            heading: "The scoring",
            paragraphs: [
              "A small Express function on Vercel blends four signals: Google Safe Browsing (35%), domain age (25%), a Gemini verdict (20%), and a scan of the page itself (20%). Fifty or above is unsafe. It fails closed: a missing key or a failed check counts as risky, never as safe.",
            ],
          },
          {
            heading: "What I'd fix",
            paragraphs: [
              "The backend fetches whatever URL it's handed, so it needs an SSRF guard, a size cap, and rate limiting. The four checks run one after another and could run in parallel. Domain risk is a crude 20 or 80. And every tapped URL goes to my server, so this isn't a private checker.",
            ],
          },
        ],
      },
      {
        id: "chikki",
        title: "Chikki",
        meta: "Chrome Extension · Work in progress",
        image: "/projects/chikki/cover.png",
        gallery: [
          "/projects/chikki/cover.png",
          "/projects/chikki/01-demo.mp4",
          "/projects/chikki/02-mockup-2.png",
          "/projects/chikki/03-mockup-3.png",
        ],
        href: "https://chikki-lemon.vercel.app/",
        date: "2025",
        summary:
          "A Chrome extension that rewrites your text where you type it and keeps it sounding like you. Work in progress.",
        role: "Product design and extension development. Solo.",
        stack: "React, TypeScript, Vite, WebExtensions API, React Router.",
        sections: [
          {
            heading: "Status",
            paragraphs: [
              "In progress. The landing page, waitlist, sign-up, and onboarding are live. The extension is being built behind them, and the video is the current prototype.",
            ],
          },
          {
            heading: "The idea",
            paragraphs: [
              "Writing help usually means leaving the page, pasting into another tab, and getting back text that sounds like everyone else's. Chikki works in place. Highlight a passage, say what you want in a few words, and get a rewrite that keeps your phrasing. Suggestions arrive when you ask, not as a wall of red underlines.",
            ],
          },
          {
            heading: "Hard problems ahead",
            paragraphs: [
              "Privacy comes first: what leaves the browser, and when, has to be explicit and in the user's control. The content script must behave in many different editors and never touch text you didn't select. And I need a repeatable way to measure whether your voice is actually preserved, not just a feeling from reading outputs.",
            ],
          },
        ],
      },
    ],
  },
  {
    full: {
      id: "docq",
      title: "Doctor booking with AI recommendations",
      meta: "Healthcare App",
      image: "/projects/docq/cover.png",
      gallery: [
        "/projects/docq/01-welcome.jpg",
        "/projects/docq/02-login.jpg",
        "/projects/docq/03-create-account.jpg",
        "/projects/docq/04-home.jpg",
        "/projects/docq/05-demo.mp4",
        "/projects/docq/06-find-a-doctor.jpg",
        "/projects/docq/07-search.jpg",
        "/projects/docq/08-doctor-details.jpg",
        "/projects/docq/09-choose-patient.jpg",
        "/projects/docq/10-choose-patient-selected.jpg",
        "/projects/docq/11-schedule.jpg",
        "/projects/docq/12-appointment.jpg",
        "/projects/docq/13-profile.jpg",
      ],
      href: "https://read.cv/heysagnik",
      date: "2024",
      summary:
        "Doctor booking in three steps: find a specialist, pay and get a token, consult. No more long waits at the hospital.",
      role: "Lead UI/UX Designer and Frontend Engineer.",
      stack: "React Native, Node.js, PostgreSQL.",
      sections: [
        {
          heading: "What it does",
          paragraphs: [
            "Patients search by doctor name or speciality, read experience and reviews, pick a patient and a time slot, and get an OTP-backed appointment. The home screen also covers medicine orders, lab tests, nurse assistance, and a health-answers chat, so one app handles most of what a clinic visit involves.",
          ],
        },
      ],
    },
  },
  {
    pair: [
      {
        id: "bleesie",
        title: "Bleesie",
        meta: "Mental Wellness App",
        image: "/projects/bleesie/cover.png",
        gallery: [
          "/projects/bleesie/01-splash.jpg",
          "/projects/bleesie/02-explore.jpg",
          "/projects/bleesie/03-journal.jpg",
          "/projects/bleesie/04-meditation.jpg",
          "/projects/bleesie/05-profile.jpg",
        ],
        href: "",
        date: "2024",
        summary:
          "A mental wellness companion for people who feel alone: a private AI friend, backed by real doctors. I co-founded it and own product and engineering.",
        role: "Co-founder. Product and engineering.",
        credits: "Sagnik Sahoo and Sayantan, co-founders. A Foressss product.",
        sections: [
          {
            heading: "Context",
            paragraphs: [
              "Bleesie started as a pitch and an early build under the working name YouGood. I co-founded it with Sayantan and own what we build and how it ships. The screens here are from a July 2024 build, and everything on the roadmap is a plan, not a result.",
            ],
          },
          {
            heading: "The insight",
            paragraphs: [
              "Our deck's starting point is stark: about one in five adults in India lives with a mental illness, and most get little help. Conversations with mental health professionals pointed at a root cause, loneliness. So we aimed at that, not at another mood tracker: a friend you can talk to without being judged, with human doctors behind it for what AI shouldn't handle alone.",
            ],
          },
          {
            heading: "Scoping the first release",
            paragraphs: [
              "I cut the first release to four tabs (Home, Explore, Experts, Profile) and built journaling and meditation first. The journal opens on a lined page with one prompt and one Save button, because starting is the hard part. Meditation has a single control and no timers or streaks. Explore speaks in outcomes like Manage Stress, not diagnoses. Courses, CBT, and doctor access come later, and the navigation already holds their place.",
            ],
          },
          {
            heading: "Rules for sensitive data",
            paragraphs: [
              "Journal entries are about as sensitive as consumer data gets. The rules I build to: collect the minimum, keep entry text out of analytics, make delete and export one tap, and settle where entries live before the first public release. A crisis path is a core flow, not a footnote.",
            ],
          },
          {
            heading: "What I'd measure",
            paragraphs: [
              "Three numbers first: how many new users write a first entry, how many come back within a week, and how many finish a meditation. The deck's 100,000-user goal is a target, not a result.",
            ],
          },
        ],
      },
      {
        id: "attenda",
        title: "Attenda",
        meta: "Mobile App",
        image: "/projects/attenda/cover.png",
        gallery: [
          "/projects/attenda/01-welcome.jpg",
          "/projects/attenda/02-scan.jpg",
          "/projects/attenda/03-details.jpg",
          "/projects/attenda/04-history.jpg",
        ],
        href: "https://github.com/heysagnik/attenda",
        date: "2025",
        summary:
          "Scan an attendee's encrypted QR code to log attendance at an event, then search the history. Built in Flutter.",
        stack: "Flutter, Dart, MongoDB.",
      },
    ],
  },
  {
    pair: [
      {
        id: "screenrec",
        title: "ScreenREC",
        meta: "Web Tool",
        image: "/projects/screenrec/cover.png",
        gallery: ["/projects/screenrec/cover.png"],
        href: "https://github.com/heysagnik/screenREC",
        date: "2021–26",
        summary:
          "A free screen recorder and editor that runs in your browser. No account, no watermark, no time limit. Over 290 GitHub stars.",
        role: "Product, design, and full-stack build. Solo, open source.",
        stack:
          "Next.js, React, TypeScript, MediaRecorder API, ffmpeg.wasm, Express, Turborepo.",
        sections: [
          {
            heading: "Where it started",
            paragraphs: [
              "In 2021 I needed to record online classes, and every option came with an install, a watermark, a time cap, or a sign-up wall. Version 1 was one page of Pug and Parcel. People kept using it, so I open-sourced it, and the repo has passed 290 stars.",
            ],
          },
          {
            heading: "The rewrite",
            paragraphs: [
              "Version 2 (2026) is Next.js and TypeScript. It records the screen, camera, and microphone as separate streams and picks the best codec your browser supports. A timeline editor with split, cut, and 50-step undo works on those streams, so you can change the layout after recording. Projects live in the browser's private file system, and exports run ffmpeg compiled to WebAssembly, inside the page.",
            ],
          },
          {
            heading: "The one server piece",
            paragraphs: [
              "MP4 conversion can go to a small Express service running native ffmpeg: a 500 MB cap, five requests a minute, and files deleted after ten minutes. Recording and editing stay local, but that conversion briefly uploads your file. I'd rather say so plainly than claim nothing ever leaves your device.",
            ],
          },
          {
            heading: "Next",
            paragraphs: [
              "The tests are still a template, and a recorder is exactly where a regression costs someone their take. Crash recovery, saving chunks as they arrive, comes first.",
            ],
          },
        ],
      },
      {
        id: "linkees",
        title: "Linkees",
        meta: "React Component Library",
        image: "/projects/linkees/cover.png",
        gallery: ["/projects/linkees/cover.png"],
        href: "https://github.com/heysagnik/Linkees",
        date: "2022",
        summary:
          "A bio-link page as a React package. Pass a name and a list of links, and get a polished page you own and can host anywhere.",
        role: "Library design, build, and publishing. Solo, open source.",
        stack:
          "React, TypeScript, Framer Motion, Webpack, Jest, Vite, npm.",
        sections: [
          {
            heading: "Why",
            paragraphs: [
              "Hosted bio-link tools make everyone's page look the same and keep the good features behind a plan. I wanted the page as code: small, themeable, and mine.",
            ],
          },
          {
            heading: "The API",
            paragraphs: [
              "Install the package, pass a name, an avatar, and a list of cards, and it renders. Card types form a discriminated union: known channels like GitHub or YouTube get a default cover for free, while a custom card without an image fails to compile. Each card is a real focusable control that works with Enter and Space, and links are validated and opened with noopener.",
            ],
          },
          {
            heading: "Shipping a package",
            paragraphs: [
              "The repo is a small monorepo with the library and an example app. Webpack builds CommonJS and ES module bundles with TypeScript declarations, and it has been on npm since 2022. Next: CSS variables for theming, and a trimmed stylesheet.",
            ],
          },
        ],
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
