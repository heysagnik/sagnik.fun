export interface Experience {
  role: string;
  company: string;
  url: string;
  screenshot: string;
  logo: string;
  date: string;
}

export const EXPERIENCE: Experience[] = [
  {
    role: "AI Engineer Intern",
    company: "mytribe.in",
    url: "https://mytribe.in/",
    screenshot: "/images/experience/mytribe.jpg",
    logo: "/images/experience/mytribe-logo.png",
    date: "Jan – Jun 2026",
  },
  {
    role: "Founding Engineer",
    company: "MEGG",
    url: "https://www.meggfashion.in/",
    screenshot: "/images/experience/megg.jpg",
    logo: "/images/experience/megg-pad-slight.png",
    date: "Nov 2025 – Present",
  },
  {
    role: "SDE Intern",
    company: "IndianOil Refinery",
    url: "https://iocl.com/haldia-refinery",
    screenshot: "/images/experience/iocl-haldia.jpg",
    logo: "/images/experience/iocl-emblem.png",
    date: "May – Jun 2025",
  },
];

export type StickerIcon = "medal" | "users" | "star";

export interface Sticker {
  icon: StickerIcon;
  kicker: string;
  title: string;
}

export const STICKERS: Sticker[] = [
  { icon: "users", kicker: "Daily active users", title: "11.5K on my apps" },
  { icon: "star", kicker: "GitHub stars", title: "300 across my repos" },
  { icon: "medal", kicker: "Product Hunt", title: "#2 Product of the Day" },
];

export interface Award {
  name: string;
  logo: string;
  position: string;
  tier: "gold" | "silver" | "bronze";
  /** Tile colour behind the logo: dark for light-on-transparent marks, pale otherwise. */
  background: string;
  /** Space around the logo inside the tile; larger shrinks it. Defaults to 16%. */
  padding?: string;
}

export const AWARDS: Award[] = [
  { name: "DevFest '23", logo: "/images/awards/devfest.png", position: "Runner-up", tier: "silver", background: "#ffffff" },
  { name: "HackSquad '24", logo: "/images/awards/hacksquad.jpg", position: "1st", tier: "gold", background: "#0a0a0f" },
  { name: "DUHacks", logo: "/images/awards/duhacks.png", position: "1st", tier: "gold", background: "#f3f0ff" },
  { name: "localhost-hq", logo: "/images/awards/localhost-mark.svg", position: "Runner-up", tier: "silver", background: "#0d0d0d", padding: "24%" },
  { name: "HackByte", logo: "/images/awards/hackbyte.png", position: "4th", tier: "bronze", background: "#f1e8ff" },
  { name: "MP Police Cyber Hackathon", logo: "/images/awards/mp-police-gold.png", position: "1st", tier: "gold", background: "#0d2b4e", padding: "22%" },
];
