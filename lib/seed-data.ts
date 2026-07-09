import type { Experience, Project, Skill } from "./types";

/**
 * Canonical content extracted from the original static portfolio.
 * Used to (a) seed Supabase and (b) render the site when Supabase
 * env vars are not yet configured, so the portfolio never renders empty.
 * Keep in sync with supabase/seed.sql.
 */

export const SEED_PROJECTS: Project[] = [
  {
    id: "seed-01",
    slug: "hotel-website",
    title: "Hotel Website",
    label: "Frontend · Hospitality",
    description:
      "A modern hotel showcase website with polished UI, room galleries, amenity pages, and an inquiry system integrated with Google Forms and email.",
    tech_stack: ["Vercel", "HTML", "CSS", "JavaScript", "EmailJS"],
    image_url: null,
    live_url: "https://web-velara.vercel.app/",
    admin_url: null,
    preview_url: "https://web-velara.vercel.app/",
    sort_order: 1,
  },
  {
    id: "seed-02",
    slug: "luxury-heaven-booking-system",
    title: "Luxury Heaven Booking System",
    label: "Full Stack · Booking System",
    description:
      "Full-featured hotel web application with real-time booking flow, admin dashboard, calendar availability, room management, and backend integration.",
    tech_stack: ["PHP", "MySQL", "JavaScript", "Full Stack"],
    image_url: null,
    live_url: "https://daniluxuryheaven.kesug.com/",
    admin_url: "https://daniluxuryheaven.kesug.com/admin",
    preview_url: "https://daniluxuryheaven.kesug.com/",
    sort_order: 2,
  },
  {
    id: "seed-03",
    slug: "dental-clinic-management-system",
    title: "Dental Clinic Management System",
    label: "Full Stack · Healthcare System",
    description:
      "A full-featured dental clinic management system with both client-facing pages and an admin dashboard. It streamlines appointment scheduling, patient record management, and daily clinic operations using a structured MVC architecture for scalability and performance.",
    tech_stack: ["PHP (MVC)", "MySQL", "JavaScript", "HTML", "CSS"],
    image_url: null,
    live_url: "https://dentalcareclinic.kesug.com/",
    admin_url: "https://dentalcareclinic.kesug.com/admin",
    preview_url: "https://dentalcareclinic.kesug.com/",
    sort_order: 3,
  },
  {
    id: "seed-04",
    slug: "veterinary-clinic-management-system",
    title: "Veterinary Clinic Management System",
    label: "Full Stack · Healthcare System",
    description:
      "A full-featured veterinary clinic management system designed to streamline operations such as appointment scheduling, patient records, and clinic workflows. Built with a structured MVC architecture, it provides an efficient and scalable solution for modern veterinary practices.",
    tech_stack: ["PHP (MVC)", "MySQL", "JavaScript", "HTML", "CSS"],
    image_url: null,
    live_url: "https://vetclinic.kesug.com/",
    admin_url: "https://vetclinic.kesug.com/admin",
    preview_url: "https://vetclinic.kesug.com/",
    sort_order: 4,
  },
  {
    id: "seed-05",
    slug: "iron-forge-gym-website",
    title: "Iron Forge Gym Website",
    label: "Full Stack · Fitness Platform",
    description:
      "A modern gym website designed to showcase services, memberships, and training programs. Includes a structured system for managing user interactions and content, providing a smooth and engaging experience for potential members.",
    tech_stack: ["PHP (MVC)", "MySQL", "JavaScript", "HTML", "CSS"],
    image_url: null,
    live_url: "https://ironforgegym.kesug.com/",
    admin_url: "https://ironforgegym.kesug.com/admin",
    preview_url: "https://ironforgegym.kesug.com/",
    sort_order: 5,
  },
  {
    id: "seed-06",
    slug: "ui-design-collection",
    title: "UI Design Collection",
    label: "UI/UX · Design Systems",
    description:
      "A collection of landing pages, dashboards, and custom UI components for hospitality, e-commerce, and SaaS — available upon request or presentation.",
    tech_stack: ["UI/UX", "Figma", "Frontend", "Design"],
    image_url: null,
    live_url: null,
    admin_url: null,
    preview_url: null,
    sort_order: 6,
  },
];

export const SEED_SKILLS: Skill[] = [
  // Languages
  { id: "sk-01", name: "JavaScript", category: "languages", sort_order: 1 },
  { id: "sk-02", name: "PHP", category: "languages", sort_order: 2 },
  { id: "sk-03", name: "Python", category: "languages", sort_order: 3 },
  { id: "sk-04", name: "SQL", category: "languages", sort_order: 4 },
  { id: "sk-05", name: "HTML5", category: "languages", sort_order: 5 },
  { id: "sk-06", name: "CSS3", category: "languages", sort_order: 6 },
  // Frontend
  { id: "sk-07", name: "React.js", category: "frontend", sort_order: 1 },
  { id: "sk-08", name: "Next.js", category: "frontend", sort_order: 2 },
  { id: "sk-09", name: "Tailwind CSS", category: "frontend", sort_order: 3 },
  { id: "sk-10", name: "Responsive Design", category: "frontend", sort_order: 4 },
  { id: "sk-11", name: "CSS Animations", category: "frontend", sort_order: 5 },
  { id: "sk-12", name: "UI/UX Design", category: "frontend", sort_order: 6 },
  // Backend
  { id: "sk-13", name: "Node.js", category: "backend", sort_order: 1 },
  { id: "sk-14", name: "Laravel", category: "backend", sort_order: 2 },
  { id: "sk-15", name: "MySQL", category: "backend", sort_order: 3 },
  { id: "sk-16", name: "REST APIs", category: "backend", sort_order: 4 },
  { id: "sk-17", name: "PHP MVC", category: "backend", sort_order: 5 },
  // Tools
  { id: "sk-18", name: "Git & GitHub", category: "tools", sort_order: 1 },
  { id: "sk-19", name: "VS Code", category: "tools", sort_order: 2 },
  { id: "sk-20", name: "XAMPP", category: "tools", sort_order: 3 },
  { id: "sk-21", name: "Figma", category: "tools", sort_order: 4 },
  { id: "sk-22", name: "Vercel", category: "tools", sort_order: 5 },
];

/** Static profile / identity content (not stored in DB). */
export const PROFILE = {
  name: "Daniel De Vera",
  firstName: "Daniel",
  lastName: "De Vera",
  role: "Full Stack Web Developer",
  brand: "VeraSys",
  location: "Pangasinan, Philippines",
  age: 21,
  heroHeadline: "If it lives in a browser, I can build it.",
  heroSub:
    "E-commerce, booking systems, clinic & gym platforms — full-stack, from database to pixel.",
  availability: "Available for new projects",
  email: "kenchinxyz@gmail.com",
  cvPath: "/Daniel_De_Vera_CV.pdf",
  photo: "/DDV.png",
  aboutParagraphs: [
    "Hi — I'm Daniel De Vera, a 21-year-old Full Stack Web Developer from Pangasinan, Philippines. I specialize in building modern, aesthetic, and highly functional websites.",
    "I care deeply about the intersection of design and engineering. Every project I take on is treated as a product — not just a website — with real attention paid to user experience, performance, and visual craft.",
    "When I'm not building, I'm studying new patterns in web architecture, exploring UI/UX design trends, and sharpening my skills across the full stack.",
  ],
  stats: [
    { num: "3+", label: "Years of Experience" },
    { num: "20+", label: "Projects Shipped" },
    { num: "∞", label: "Bugs Squashed" },
    { num: "01", label: "Coffee at a Time" },
  ],
  socials: {
    whatsapp: { href: "https://wa.me/639954453914", label: "+63 995 445 3914" },
    facebook: {
      href: "https://www.facebook.com/daniel.divera.39",
      label: "Daniel De Vera",
    },
    instagram: {
      href: "https://www.instagram.com/_.knchinnn",
      label: "@_.knchinnn",
    },
  },
} as const;

export const EXPERIENCE: Experience[] = [
  {
    id: "exp-01",
    sort_order: 1,
    date: "2026 — Present",
    role: "Freelance Full Stack Developer",
    company: "Self-Employed · Remote · Philippines",
    points: [
      "Designed and developed 20+ custom websites for hotels, resorts, and hospitality businesses worldwide",
      "Built full booking systems with admin dashboards, room calendar availability, and payment flows using PHP and MySQL",
      "Delivered responsive, SEO-optimized frontends using HTML, CSS, JavaScript, and React",
      "Collaborated directly with clients from requirements gathering through post-launch support",
    ],
  },
  {
    id: "exp-02",
    sort_order: 2,
    date: "2025 (6 months)",
    role: "Web Development Intern",
    company: "Local IT Solutions Company · Pangasinan, Philippines",
    points: [
      "Assisted senior developers building and maintaining client websites",
      "Contributed to front-end development with HTML, CSS, and JavaScript",
      "Participated in code reviews and learned industry best practices firsthand",
    ],
  },
  {
    id: "exp-03",
    sort_order: 3,
    date: "2024",
    role: "Freelance Web Developer",
    company: "Private Client · United States",
    points: [
      "Developed a custom website for an adult home care business focused on elderly services",
      "Designed and implemented a clean, user-friendly interface tailored for accessibility and trust",
      "Worked directly with the client to gather requirements and deliver a fully functional web solution",
    ],
  },
  {
    id: "exp-04",
    sort_order: 4,
    date: "2023 — 2026",
    role: "BSIT Student",
    company: "University of the Philippines · Pangasinan, Philippines",
    points: [
      "Bachelor of Science in Information Technology — specialization in Web Development",
      "Relevant coursework: Web Systems, Database Management, Software Engineering, UI/UX Design",
    ],
  },
];
