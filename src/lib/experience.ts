export interface Experience {
  role: string;
  company: string;
  url: string;
  screenshot: string;
  date: string;
}

export const EXPERIENCE: Experience[] = [
  {
    role: "AI Engineer Intern",
    company: "mytribe.in",
    url: "https://mytribe.in/",
    screenshot: "/images/experience/mytribe.jpg",
    date: "Jan – Jun 2026",
  },
  {
    role: "Founding Engineer",
    company: "MEGG",
    url: "https://www.meggfashion.in/",
    screenshot: "/images/experience/megg.jpg",
    date: "Nov 2025 – Present",
  },
  {
    role: "SDE Intern",
    company: "IndianOil Refinery",
    url: "https://iocl.com/haldia-refinery",
    screenshot: "/images/experience/iocl-haldia.jpg",
    date: "May – Jun 2025",
  },
];

export const ACHIEVEMENTS = [
  {
    title: "6x hackathon winner",
    detail:
      "DevFest '23, HackSquad '24, DUHacks, localhost-hq, and the MP Police Cyber Hackathon, where PhisGuard won \"Public Impact in Cyber Safety\".",
  },
  {
    title: "200+ DSA problems solved",
    detail: "Across LeetCode, Codeforces, and CodeChef.",
  },
  {
    title: "GDSC Android Lead, VIT Bhopal",
    detail: "Ran 6+ workshops on Flutter and Gen AI for 200+ students.",
  },
];
