// Your content lives in ./content — one JSON file per section:
//   landing.json       hero: greeting, name, rotating roles (any number, at least one)
//   about.json         About Me
//   whatIDo.json       the two "What I Do" cards (keep exactly two)
//   projects.json      My Projects
//   publications.json  Publications & Talks
//   awards.json        Awards & Recognition
//   experience.json    Experience & Leadership
//   skills.json        Skills & Expertise
//   art.json           Art Portfolio
//   media.json         Featured in Media
//   moments.json       Moments from Life
//   contact.json       email, phone, GitHub, LinkedIn (also used by the side icons)
// In the list files, add, remove or reorder items freely.
// Leave `image` as "" to show the glass placeholder, or set it to a file in
// /public/images (e.g. "/images/my-project.webp").
// Leave `link` as "" to hide that item's link button.
// The types below check every file's shape at build time, so a typo or a
// missing field shows up as a build error instead of a broken page.

import landingJson from "./content/landing.json";
import aboutJson from "./content/about.json";
import whatIDoJson from "./content/whatIDo.json";
import projectsJson from "./content/projects.json";
import publicationsJson from "./content/publications.json";
import awardsJson from "./content/awards.json";
import experienceJson from "./content/experience.json";
import skillsJson from "./content/skills.json";
import artJson from "./content/art.json";
import mediaJson from "./content/media.json";
import momentsJson from "./content/moments.json";
import contactJson from "./content/contact.json";

export type Landing = {
  greeting: string;
  firstName: string;
  lastName: string;
  intro: string;
  roles: string[];
};

export type About = {
  title: string;
  text: string;
};

export type WhatIDoCard = {
  title: string;
  description: string;
  tools: string[];
};

export type Contact = {
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  copyrightYear: string;
};

export type Skill = {
  name: string;
  // Logo key, see src/components/skillIcons.tsx ("" shows no logo)
  icon: string;
};

export type SkillGroup = {
  category: string;
  // Header icon key, see src/components/skillIcons.tsx
  icon: string;
  // Not shown at the moment (the cards only show the title and skills)
  description: string;
  skills: Skill[];
};

export type Experience = {
  role: string;
  organization: string;
  year: string;
  location: string;
  // Website or, failing that, a page about the organization; blank url hides it
  link: ProjectLink;
  description: string;
  highlights: string[];
  // Logo under public/; blank shows the organization's initials instead
  logo: string;
};

export type Award = {
  title: string;
  // Competition, event or organisation that gave the award
  event: string;
  level: "International" | "National";
  location: string;
  // "" hides it
  year: string;
  // Abrar's part in it, e.g. "Team Leader" or "Mentor"
  role: string;
  // One headline fact, shown emphasised
  highlight: string;
  description: string;
  image: string;
  links: ProjectLink[];
};

export type ProjectLink = {
  name: string;
  url: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  status: string;
  year: string;
  featured: boolean;
  summary: string;
  // Longer write-up, one paragraph per item (not shown on the card yet)
  description: string[];
  image: string;
  tags: string[];
  // Extra links shown under the card, e.g. { "name": "Project Video", "url": "..." }
  links: ProjectLink[];
  // Source code URL; "" shows the Code button greyed out ("coming soon")
  code: string;
};

export type Publication = {
  title: string;
  // In author order; Abrar's name is highlighted automatically
  authors: string[];
  venue: string;
  location: string;
  publisher: string;
  year: string;
  // e.g. "Conference Paper", "Journal Article", "Talk"
  type: string;
  // Abrar's part, e.g. "First Author" ("" hides it)
  role: string;
  overview: string;
  // Photo beside the text ("" shows a placeholder)
  image: string;
  // "contain": a cut-out floating on a glow (whole image shown)
  // "cover": a photograph filling a taller frame (edges may be trimmed)
  imageFit: "contain" | "cover";
  // Main button
  link: string;
  linkLabel: string;
  // Extra buttons, e.g. { "name": "Event page", "url": "..." }
  moreLinks: ProjectLink[];
};

export type ArtLayout =
  | "text-left" // text left, artwork right (full-height)
  | "text-right" // artwork left, text right
  | "overlay-dark" // full-bleed artwork, light text on a dark veil
  | "overlay-light" // full-bleed artwork, dark text on a pale panel
  | "row" // several artworks in a row, text below
  | "mosaic" // three studies in a staggered grid beside the text
  | "triptych" // artwork | text | artwork
  | "wide" // one landscape artwork framed large, text below
  | "framed" // text beside a whole artwork in a white mat (needs "ratio")
  | "framed-right"; // the same, with the artwork left and the text right

export type Artwork = {
  slug: string;
  title: string;
  medium: string;
  theme: string;
  // As written on the piece, e.g. "25/12/24" ("" hides it)
  date: string;
  description: string;
  // File names in /public/images/art/gallery (without .webp); the 760px
  // previews are in gallery/thumb
  images: string[];
  // Which part of the artwork to keep when it's cropped, e.g. "70% center"
  focus: string;
  // "cover" fills the frame (may crop); "contain" shows the whole painting,
  // with a soft blurred copy filling the spare space
  fit: "cover" | "contain";
  // Side-by-side layouts only: the painting's width / height (e.g. 0.74).
  // When set, its column is sized to the painting so it shows complete with
  // no cropping and no bands; 0 keeps the usual half-and-half split
  ratio: number;
  layout: ArtLayout;
  // "portfolio": the PDF collection; "new": the New Works chapter
  collection: "portfolio" | "new";
  // Shown in the Art section on the main page
  featured: boolean;
};

export type ArtPortfolio = {
  intro: string;
  artist: { skills: string[]; bio: string[] };
  artworks: Artwork[];
};

export type Moment = {
  caption: string;
  date: string;
  image: string;
};

export type MediaFeature = {
  outlet: string;
  headline: string;
  date: string;
  type: string;
  link: string;
  // Preview image under public/; blank shows the outlet name instead
  image: string;
};

export const landing: Landing = landingJson;
export const about: About = aboutJson;
export const whatIDo: WhatIDoCard[] = whatIDoJson;
export const projects: Project[] = projectsJson;
// JSON gives `imageFit` as plain text; narrow just that field
export const publications: Publication[] = publicationsJson.map((pub) => ({
  ...pub,
  imageFit: pub.imageFit as Publication["imageFit"],
}));
// JSON gives `level` as plain text; narrow just that field so every other
// field is still type-checked
export const awards: Award[] = awardsJson.map((award) => ({
  ...award,
  level: award.level as Award["level"],
}));
export const experience: Experience[] = experienceJson;
export const skills: SkillGroup[] = skillsJson;
// JSON gives the union fields as plain text; narrow just those
export const art: ArtPortfolio = {
  ...artJson,
  artworks: artJson.artworks.map((work) => ({
    ...work,
    layout: work.layout as ArtLayout,
    fit: work.fit as Artwork["fit"],
    collection: work.collection as Artwork["collection"],
  })),
};
export const artworks = art.artworks;
export const artImage = (name: string, size: "full" | "thumb" = "full") =>
  `/images/art/gallery/${size === "thumb" ? "thumb/" : ""}${name}.webp`;
export const media: MediaFeature[] = mediaJson;
export const moments: Moment[] = momentsJson;
export const contact: Contact = contactJson;
