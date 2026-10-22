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

export type SkillGroup = {
  category: string;
  description: string;
  skills: string[];
};

export type Experience = {
  role: string;
  organization: string;
  year: string;
  location: string;
  description: string;
  highlights: string[];
};

export type Award = {
  title: string;
  issuer: string;
  year: string;
  description: string;
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
  authors: string;
  venue: string;
  year: string;
  type: string;
  link: string;
};

export type Artwork = {
  title: string;
  medium: string;
  year: string;
  image: string;
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
};

export const landing: Landing = landingJson;
export const about: About = aboutJson;
export const whatIDo: WhatIDoCard[] = whatIDoJson;
export const projects: Project[] = projectsJson;
export const publications: Publication[] = publicationsJson;
export const awards: Award[] = awardsJson;
export const experience: Experience[] = experienceJson;
export const skills: SkillGroup[] = skillsJson;
export const artworks: Artwork[] = artJson;
export const media: MediaFeature[] = mediaJson;
export const moments: Moment[] = momentsJson;
export const contact: Contact = contactJson;
